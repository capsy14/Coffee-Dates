from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import pandas as pd
import numpy as np
from datetime import datetime
import logging
import asyncio
import os
from typing import List, Optional

# Import our models and schemas
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.matchmaker import CoffeeDatingMatchmaker
from data.schemas import (
    MatchRequest, MatchResponse, FeedbackRequest, HealthResponse,
    ModelStatsResponse, Collections, MatchProfile
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
matchmaker = None
mongodb_client = None
database = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global matchmaker, mongodb_client, database
    
    # Initialize ML model
    matchmaker = CoffeeDatingMatchmaker()
    logger.info("ML Matchmaker initialized")
    
    # Connect to MongoDB
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    mongodb_client = AsyncIOMotorClient(mongodb_url)
    database = mongodb_client.coffee_dates
    
    # Test connection
    try:
        await database.command('ping')
        logger.info("Connected to MongoDB successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
    
    # Load existing model if available
    try:
        model_path = "models/trained_matchmaker.joblib"
        if os.path.exists(model_path):
            matchmaker.load_model(model_path)
            logger.info("Loaded existing trained model")
    except Exception as e:
        logger.warning(f"Could not load existing model: {e}")
    
    yield
    
    # Shutdown
    if mongodb_client:
        mongodb_client.close()

app = FastAPI(
    title="Coffee Dates ML API",
    description="Machine Learning powered matchmaking service for Coffee Dates app",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_database():
    """Dependency to get database connection"""
    return database

async def get_matchmaker():
    """Dependency to get matchmaker instance"""
    return matchmaker

@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Coffee Dates ML API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "recommendations": "/recommendations",
            "feedback": "/feedback",
            "train": "/train",
            "stats": "/stats"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check(
    db = Depends(get_database),
    ml_model = Depends(get_matchmaker)
):
    """Health check endpoint"""
    # Check database connection
    db_connected = False
    try:
        await db.command('ping')
        db_connected = True
    except:
        pass
    
    # Check model status
    model_loaded = ml_model is not None
    
    return HealthResponse(
        status="healthy" if db_connected and model_loaded else "degraded",
        model_version=ml_model.model_version if ml_model else "unknown",
        uptime="running",
        database_connected=db_connected,
        model_loaded=model_loaded
    )

@app.post("/recommendations", response_model=List[MatchResponse])
async def get_recommendations(
    request: MatchRequest,
    background_tasks: BackgroundTasks,
    db = Depends(get_database),
    ml_model = Depends(get_matchmaker)
):
    """Get match recommendations for a user"""
    try:
        # Fetch user data from MongoDB
        users_collection = db[Collections.USERS]
        interactions_collection = db[Collections.INTERACTIONS]
        
        # Get all users
        users_cursor = users_collection.find({})
        users_data = await users_cursor.to_list(length=None)
        
        if not users_data:
            raise HTTPException(status_code=404, detail="No users found in database")
        
        # Get interactions
        interactions_cursor = interactions_collection.find({})
        interactions_data = await interactions_cursor.to_list(length=None)
        
        # Convert to DataFrames
        users_df = pd.DataFrame(users_data)
        interactions_df = pd.DataFrame(interactions_data) if interactions_data else pd.DataFrame()
        
        # Flatten nested profile data
        if not users_df.empty:
            users_df = flatten_user_data(users_df)
        
        # Get recommendations from ML model
        recommendations = ml_model.get_match_recommendations(
            request.user_id, users_df, interactions_df, request.top_k
        )
        
        if not recommendations:
            return []
        
        # Convert to response format
        response_recommendations = []
        for rec in recommendations:
            match_profile = MatchProfile(
                name=rec['profile']['name'],
                age=rec['profile']['age'],
                photo=rec['profile']['photo'],
                bio=rec['profile']['bio'],
                interests=rec['profile']['interests'],
                coffee_preferences=rec['profile']['coffee_preferences'],
                personality_type=rec['profile']['personality_type']
            )
            
            match_response = MatchResponse(
                user_id=rec['user_id'],
                score=rec['score'],
                reasons=rec['reasons'] if request.include_reasons else [],
                profile=match_profile
            )
            response_recommendations.append(match_response)
        
        # Store predictions in database (background task)
        background_tasks.add_task(
            store_predictions,
            db,
            request.user_id,
            recommendations,
            ml_model.model_version
        )
        
        return response_recommendations
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback")
async def record_feedback(
    request: FeedbackRequest,
    background_tasks: BackgroundTasks,
    db = Depends(get_database)
):
    """Record user feedback for model improvement"""
    try:
        # Store feedback in predictions collection
        predictions_collection = db[Collections.ML_PREDICTIONS]
        
        feedback_data = {
            "suggested_user_id": request.target_user_id,
            "user_action": request.action,
            "timestamp": datetime.utcnow(),
            "interaction_context": request.interaction_context
        }
        
        await predictions_collection.update_one(
            {"user_id": request.user_id},
            {"$push": {"feedback_received": feedback_data}},
            upsert=True
        )
        
        # Trigger model retraining check (background task)
        background_tasks.add_task(check_and_retrain, db)
        
        return {"status": "feedback recorded", "user_id": request.user_id}
        
    except Exception as e:
        logger.error(f"Error recording feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train_model(
    background_tasks: BackgroundTasks,
    db = Depends(get_database),
    ml_model = Depends(get_matchmaker)
):
    """Manually trigger model training"""
    try:
        background_tasks.add_task(train_model_task, db, ml_model)
        return {"status": "training started", "message": "Model training initiated in background"}
    except Exception as e:
        logger.error(f"Error initiating training: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats", response_model=ModelStatsResponse)
async def get_model_stats(db = Depends(get_database)):
    """Get model statistics and performance metrics"""
    try:
        # Count documents in each collection
        users_count = await db[Collections.USERS].count_documents({})
        interactions_count = await db[Collections.INTERACTIONS].count_documents({})
        feedback_count = await db[Collections.FEEDBACK].count_documents({})
        
        # Get latest model metrics (placeholder)
        accuracy_metrics = {
            "precision": 0.75,
            "recall": 0.68,
            "f1_score": 0.71,
            "user_satisfaction": 0.82
        }
        
        return ModelStatsResponse(
            model_version="v1.0",
            total_users=users_count,
            total_interactions=interactions_count,
            total_feedback=feedback_count,
            accuracy_metrics=accuracy_metrics,
            last_training=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Background tasks
async def store_predictions(db, user_id: str, recommendations: List[dict], model_version: str):
    """Store ML predictions in database"""
    try:
        predictions_collection = db[Collections.ML_PREDICTIONS]
        
        prediction_doc = {
            "user_id": user_id,
            "suggested_matches": recommendations,
            "model_version": model_version,
            "generated_at": datetime.utcnow()
        }
        
        await predictions_collection.replace_one(
            {"user_id": user_id},
            prediction_doc,
            upsert=True
        )
        
        logger.info(f"Stored predictions for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error storing predictions: {str(e)}")

async def check_and_retrain(db):
    """Check if model needs retraining based on feedback volume"""
    try:
        # Simple logic: retrain if we have new feedback
        feedback_collection = db[Collections.FEEDBACK]
        feedback_count = await feedback_collection.count_documents({})
        
        # For demo purposes, retrain every 100 feedback entries
        if feedback_count > 0 and feedback_count % 100 == 0:
            logger.info(f"Triggering model retraining after {feedback_count} feedback entries")
            await train_model_task(db, matchmaker)
            
    except Exception as e:
        logger.error(f"Error in retrain check: {str(e)}")

async def train_model_task(db, ml_model):
    """Background task to train the model"""
    try:
        logger.info("Starting model training task")
        
        # Fetch feedback data
        feedback_collection = db[Collections.FEEDBACK]
        feedback_cursor = feedback_collection.find({})
        feedback_data = await feedback_cursor.to_list(length=None)
        
        if not feedback_data:
            logger.warning("No feedback data available for training")
            return
        
        # Fetch interactions data
        interactions_collection = db[Collections.INTERACTIONS]
        interactions_cursor = interactions_collection.find({})
        interactions_data = await interactions_cursor.to_list(length=None)
        
        # Convert to DataFrames
        feedback_df = pd.DataFrame(feedback_data)
        interactions_df = pd.DataFrame(interactions_data) if interactions_data else pd.DataFrame()
        
        # Train the model
        trained_model = ml_model.train_feedback_model(feedback_df, interactions_df)
        
        if trained_model:
            # Save the model
            model_path = "models/trained_matchmaker.joblib"
            ml_model.save_model(model_path)
            logger.info("Model training completed and saved")
        else:
            logger.warning("Model training failed - insufficient data")
            
    except Exception as e:
        logger.error(f"Error in model training task: {str(e)}")

def flatten_user_data(users_df: pd.DataFrame) -> pd.DataFrame:
    """Flatten nested user profile data for ML processing"""
    flattened_data = []
    
    for _, user in users_df.iterrows():
        flat_user = {'user_id': user['user_id']}
        
        # Flatten profile data
        if 'profile' in user and isinstance(user['profile'], dict):
            profile = user['profile']
            flat_user.update({
                'name': profile.get('name', ''),
                'age': profile.get('age', 25),
                'gender': profile.get('gender', 'other'),
                'bio': profile.get('bio', ''),
                'interests': profile.get('interests', []),
                'personality_type': profile.get('personality_type', 'ENFP'),
                'coffee_preferences': profile.get('coffee_preferences', []),
                'date_time_preference': profile.get('date_time_preference', 'evening'),
                'photos': profile.get('photos', [])
            })
            
            # Flatten location data
            if 'location' in profile and isinstance(profile['location'], dict):
                location = profile['location']
                flat_user['location'] = location
        
        # Flatten blockchain data
        if 'blockchain_data' in user and isinstance(user['blockchain_data'], dict):
            blockchain = user['blockchain_data']
            flat_user['reputation_score'] = blockchain.get('reputation_score', 0.5)
        
        flattened_data.append(flat_user)
    
    return pd.DataFrame(flattened_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)