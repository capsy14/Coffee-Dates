import asyncio
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class DataLoader:
    def __init__(self, mongodb_url: str = "mongodb://localhost:27017"):
        self.mongodb_url = mongodb_url
        self.client = None
        self.database = None
    
    async def connect(self):
        """Connect to MongoDB"""
        self.client = AsyncIOMotorClient(self.mongodb_url)
        self.database = self.client.coffee_dates
        
        # Test connection
        try:
            await self.database.command('ping')
            logger.info("Connected to MongoDB successfully")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
    
    async def load_sample_data(self, data_path: str = "sample_data"):
        """Load sample data from JSON files into MongoDB"""
        if not self.database:
            await self.connect()
        
        collections_to_load = {
            'users': 'users',
            'interactions': 'interactions', 
            'feedback': 'feedback'
        }
        
        for file_name, collection_name in collections_to_load.items():
            file_path = os.path.join(data_path, f"{file_name}.json")
            
            if not os.path.exists(file_path):
                logger.warning(f"File {file_path} not found, skipping...")
                continue
            
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                
                if not data:
                    logger.warning(f"No data in {file_path}")
                    continue
                
                # Clear existing data in collection
                collection = self.database[collection_name]
                await collection.delete_many({})
                
                # Convert string dates to datetime objects
                processed_data = self._process_dates(data)
                
                # Insert new data
                if processed_data:
                    await collection.insert_many(processed_data)
                    logger.info(f"Loaded {len(processed_data)} records into {collection_name}")
                
            except Exception as e:
                logger.error(f"Error loading {file_path}: {e}")
    
    def _process_dates(self, data: list) -> list:
        """Convert date strings to datetime objects"""
        processed = []
        
        for item in data:
            processed_item = self._process_item_dates(item)
            processed.append(processed_item)
        
        return processed
    
    def _process_item_dates(self, item):
        """Recursively process date strings in an item"""
        if isinstance(item, dict):
            processed_item = {}
            for key, value in item.items():
                if key in ['timestamp', 'created_at', 'last_active', 'generated_at']:
                    if isinstance(value, str):
                        try:
                            processed_item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                        except:
                            processed_item[key] = value
                    else:
                        processed_item[key] = value
                elif isinstance(value, (dict, list)):
                    processed_item[key] = self._process_item_dates(value)
                else:
                    processed_item[key] = value
            return processed_item
        elif isinstance(item, list):
            return [self._process_item_dates(sub_item) for sub_item in item]
        else:
            return item
    
    async def create_indexes(self):
        """Create database indexes for better performance"""
        if not self.database:
            await self.connect()
        
        try:
            # Users collection indexes
            users_collection = self.database.users
            await users_collection.create_index("user_id", unique=True)
            await users_collection.create_index([("profile.location.latitude", 1), ("profile.location.longitude", 1)])
            await users_collection.create_index("profile.age")
            await users_collection.create_index("profile.gender")
            await users_collection.create_index("is_active")
            
            # Interactions collection indexes
            interactions_collection = self.database.interactions
            await interactions_collection.create_index([("user_id", 1), ("target_user_id", 1)])
            await interactions_collection.create_index("timestamp")
            await interactions_collection.create_index("interaction_type")
            
            # Feedback collection indexes
            feedback_collection = self.database.feedback
            await feedback_collection.create_index([("user_id", 1), ("target_user_id", 1)])
            await feedback_collection.create_index("rating")
            await feedback_collection.create_index("timestamp")
            
            # ML Predictions collection indexes
            predictions_collection = self.database.ml_predictions
            await predictions_collection.create_index("user_id", unique=True)
            await predictions_collection.create_index("generated_at")
            
            logger.info("Database indexes created successfully")
            
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")
    
    async def get_user_count(self) -> int:
        """Get total number of users"""
        if not self.database:
            await self.connect()
        return await self.database.users.count_documents({})
    
    async def get_collection_stats(self) -> dict:
        """Get statistics for all collections"""
        if not self.database:
            await self.connect()
        
        stats = {}
        collections = ['users', 'interactions', 'feedback', 'ml_predictions']
        
        for collection_name in collections:
            collection = self.database[collection_name]
            count = await collection.count_documents({})
            stats[collection_name] = count
        
        return stats

async def setup_database(mongodb_url: str = "mongodb://localhost:27017", 
                        data_path: str = "sample_data"):
    """Setup database with sample data and indexes"""
    loader = DataLoader(mongodb_url)
    
    try:
        await loader.connect()
        await loader.load_sample_data(data_path)
        await loader.create_indexes()
        
        stats = await loader.get_collection_stats()
        logger.info(f"Database setup complete. Collection stats: {stats}")
        
    finally:
        await loader.disconnect()

if __name__ == "__main__":
    # Generate sample data first
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    from data.sample_generator import SampleDataGenerator
    
    async def main():
        # Generate sample data
        generator = SampleDataGenerator()
        data = generator.generate_complete_dataset(
            num_users=1000,
            num_interactions=5000,
            num_feedback=500
        )
        
        # Save to files
        generator.save_to_json(data, "sample_data")
        
        # Load into database
        await setup_database(data_path="sample_data")
    
    asyncio.run(main())