import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from sklearn.ensemble import RandomForestRegressor
from sentence_transformers import SentenceTransformer
import torch
import joblib
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CoffeeDatingMatchmaker:
    def __init__(self):
        self.content_model = None
        self.collaborative_model = None
        self.feedback_model = None
        self.personality_compatibility = self._load_personality_matrix()
        self.tfidf_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.sentence_transformer = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        self.coffee_types = ['Espresso', 'Cappuccino', 'Latte', 'Americano', 'Mocha', 'Macchiato', 'Cold Brew', 'Turkish Coffee']
        self.time_preferences = ['morning', 'afternoon', 'evening']
        self.model_version = "v1.0"
        
    def _load_personality_matrix(self) -> pd.DataFrame:
        """Load MBTI personality compatibility matrix based on psychological research"""
        personalities = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
        
        # Research-based compatibility scores (simplified)
        compatibility_data = {
            'INTJ': {'ENTP': 0.9, 'ENFP': 0.8, 'INFJ': 0.7, 'INTP': 0.8},
            'INTP': {'ENTJ': 0.9, 'ENFJ': 0.8, 'INTJ': 0.8, 'INFJ': 0.7},
            'ENTJ': {'INTP': 0.9, 'INFP': 0.8, 'INTJ': 0.7, 'ENFP': 0.7},
            'ENTP': {'INTJ': 0.9, 'INFJ': 0.8, 'ENFJ': 0.7, 'ISFJ': 0.7},
            'INFJ': {'ENTP': 0.8, 'ENFP': 0.9, 'INTJ': 0.7, 'INTP': 0.7},
            'INFP': {'ENFJ': 0.9, 'ENTJ': 0.8, 'INFJ': 0.7, 'ENFP': 0.7},
            'ENFJ': {'INFP': 0.9, 'ISFP': 0.8, 'INTP': 0.8, 'ENTP': 0.7},
            'ENFP': {'INTJ': 0.8, 'INFJ': 0.9, 'ISFJ': 0.7, 'ISTJ': 0.6},
            'ISTJ': {'ESTP': 0.7, 'ESFP': 0.8, 'ISFP': 0.7, 'ENFP': 0.6},
            'ISFJ': {'ESFP': 0.8, 'ESTP': 0.7, 'ENTP': 0.7, 'ENFP': 0.7},
            'ESTJ': {'ISFP': 0.8, 'ISTP': 0.7, 'ESFJ': 0.6, 'ISTJ': 0.6},
            'ESFJ': {'ISFP': 0.8, 'ISTP': 0.7, 'ISTJ': 0.6, 'ESTJ': 0.6},
            'ISTP': {'ESTJ': 0.7, 'ESFJ': 0.7, 'ESTP': 0.8, 'ISFP': 0.6},
            'ISFP': {'ENFJ': 0.8, 'ESFJ': 0.8, 'ESTJ': 0.8, 'ISTJ': 0.7},
            'ESTP': {'ISFJ': 0.7, 'ISTJ': 0.7, 'ISTP': 0.8, 'ESFP': 0.6},
            'ESFP': {'ISFJ': 0.8, 'ISTJ': 0.8, 'ESTP': 0.6, 'ESFJ': 0.6}
        }
        
        # Create full matrix with default values
        matrix = np.ones((16, 16)) * 0.5  # Default compatibility
        
        for i, p1 in enumerate(personalities):
            for j, p2 in enumerate(personalities):
                if p1 == p2:
                    matrix[i][j] = 0.6  # Moderate same-type compatibility
                elif p1 in compatibility_data and p2 in compatibility_data[p1]:
                    matrix[i][j] = compatibility_data[p1][p2]
                elif p2 in compatibility_data and p1 in compatibility_data[p2]:
                    matrix[i][j] = compatibility_data[p2][p1]
        
        return pd.DataFrame(matrix, index=personalities, columns=personalities)
    
    def _get_interests_embedding(self, interests: List[str]) -> np.ndarray:
        """Get sentence transformer embeddings for interests"""
        if not interests:
            return np.zeros(384)  # MiniLM embedding size
            
        text = " ".join(interests)
        embedding = self.sentence_transformer.encode(text)
        return embedding
    
    def _encode_coffee_preference(self, coffee_prefs: List[str]) -> List[int]:
        """One-hot encode coffee preferences"""
        encoding = [1 if coffee in coffee_prefs else 0 for coffee in self.coffee_types]
        return encoding
    
    def _encode_time_preference(self, time_pref: str) -> List[int]:
        """One-hot encode time preferences"""
        encoding = [1 if time_pref == pref else 0 for pref in self.time_preferences]
        return encoding
    
    def _encode_personality(self, personality: str) -> List[int]:
        """Encode MBTI personality as binary features"""
        if not personality or len(personality) != 4:
            return [0, 0, 0, 0]
        
        encoding = []
        encoding.append(1 if personality[0] == 'E' else 0)  # Extrovert vs Introvert
        encoding.append(1 if personality[1] == 'S' else 0)  # Sensing vs Intuition
        encoding.append(1 if personality[2] == 'T' else 0)  # Thinking vs Feeling
        encoding.append(1 if personality[3] == 'J' else 0)  # Judging vs Perceiving
        
        return encoding
    
    def _calculate_activity_score(self, user_id: str, interactions_df: pd.DataFrame) -> float:
        """Calculate user activity score based on recent interactions"""
        if interactions_df.empty:
            return 0.5
        
        user_interactions = interactions_df[interactions_df['user_id'] == user_id]
        
        if user_interactions.empty:
            return 0.3  # New user
        
        # Calculate activity in last 30 days
        recent_date = datetime.now() - timedelta(days=30)
        recent_interactions = user_interactions[
            pd.to_datetime(user_interactions['timestamp']) > recent_date
        ]
        
        activity_score = min(1.0, len(recent_interactions) / 50)  # Normalize to 0-1
        return activity_score
    
    def _extract_user_features(self, user_row: pd.Series, interactions_df: pd.DataFrame) -> Dict:
        """Extract all features for a user"""
        features = {
            'user_id': user_row.get('user_id', ''),
            'age': user_row.get('age', 25),
            'coffee_pref_encoded': self._encode_coffee_preference(
                user_row.get('coffee_preferences', [])
            ),
            'time_pref_encoded': self._encode_time_preference(
                user_row.get('date_time_preference', 'evening')
            ),
            'personality_vector': self._encode_personality(
                user_row.get('personality_type', 'ENFP')
            ),
            'interests_embedding': self._get_interests_embedding(
                user_row.get('interests', [])
            ),
            'activity_score': self._calculate_activity_score(
                user_row.get('user_id', ''), interactions_df
            ),
            'reputation_score': user_row.get('reputation_score', 0.5),
            'personality_type': user_row.get('personality_type', 'ENFP')
        }
        return features
    
    def _get_personality_compatibility(self, personality1: str, personality2: str) -> float:
        """Get compatibility score between two personality types"""
        if (personality1 not in self.personality_compatibility.index or 
            personality2 not in self.personality_compatibility.columns):
            return 0.5
        
        return self.personality_compatibility.loc[personality1, personality2]
    
    def calculate_compatibility_score(self, user1_features: Dict, user2_features: Dict) -> float:
        """Calculate comprehensive compatibility score between two users"""
        
        # Age compatibility (prefer similar ages with some tolerance)
        age_diff = abs(user1_features['age'] - user2_features['age'])
        age_score = max(0, 1 - age_diff / 15)  # Penalty for large age gaps
        
        # Coffee preference similarity
        coffee_similarity = cosine_similarity(
            [user1_features['coffee_pref_encoded']], 
            [user2_features['coffee_pref_encoded']]
        )[0][0]
        
        # Time preference compatibility
        time_similarity = cosine_similarity(
            [user1_features['time_pref_encoded']], 
            [user2_features['time_pref_encoded']]
        )[0][0]
        
        # Interests similarity using sentence transformers
        interests_similarity = cosine_similarity(
            [user1_features['interests_embedding']], 
            [user2_features['interests_embedding']]
        )[0][0]
        
        # Personality compatibility
        personality_score = self._get_personality_compatibility(
            user1_features['personality_type'],
            user2_features['personality_type']
        )
        
        # Activity and reputation scores
        activity_compatibility = min(
            user1_features['activity_score'], 
            user2_features['activity_score']
        ) + 0.2  # Boost for both being active
        
        reputation_avg = (
            user1_features['reputation_score'] + 
            user2_features['reputation_score']
        ) / 2
        
        # Weighted combination
        weights = {
            'age': 0.15,
            'coffee': 0.20,
            'time': 0.10,
            'interests': 0.25,
            'personality': 0.20,
            'activity': 0.05,
            'reputation': 0.05
        }
        
        total_score = (
            weights['age'] * age_score +
            weights['coffee'] * coffee_similarity +
            weights['time'] * time_similarity +
            weights['interests'] * interests_similarity +
            weights['personality'] * personality_score +
            weights['activity'] * activity_compatibility +
            weights['reputation'] * reputation_avg
        )
        
        return min(1.0, max(0.0, total_score))
    
    def _generate_match_reasons(self, user1_features: Dict, user2_features: Dict, 
                              user1_profile: Dict, user2_profile: Dict) -> List[str]:
        """Generate human-readable reasons for match compatibility"""
        reasons = []
        
        # Coffee preferences
        coffee1 = set(user1_profile.get('coffee_preferences', []))
        coffee2 = set(user2_profile.get('coffee_preferences', []))
        common_coffee = coffee1 & coffee2
        if common_coffee:
            reasons.append(f"Both love {', '.join(list(common_coffee)[:2])}")
        
        # Interests
        interests1 = set(user1_profile.get('interests', []))
        interests2 = set(user2_profile.get('interests', []))
        common_interests = interests1 & interests2
        if common_interests:
            reasons.append(f"Shared interests: {', '.join(list(common_interests)[:2])}")
        
        # Time preferences
        if (user1_profile.get('date_time_preference') == 
            user2_profile.get('date_time_preference')):
            time_pref = user1_profile.get('date_time_preference', 'evening')
            reasons.append(f"Both prefer {time_pref} dates")
        
        # Age compatibility
        age_diff = abs(user1_profile.get('age', 25) - user2_profile.get('age', 25))
        if age_diff <= 3:
            reasons.append("Similar age group")
        elif age_diff <= 6:
            reasons.append("Compatible age range")
        
        # Personality compatibility
        p1 = user1_features['personality_type']
        p2 = user2_features['personality_type']
        compatibility_score = self._get_personality_compatibility(p1, p2)
        
        if compatibility_score > 0.8:
            reasons.append("Highly compatible personalities")
        elif compatibility_score > 0.6:
            reasons.append("Complementary personalities")
        
        # Activity levels
        if (user1_features['activity_score'] > 0.7 and 
            user2_features['activity_score'] > 0.7):
            reasons.append("Both are active users")
        
        # High reputation
        if (user1_features['reputation_score'] > 0.8 and 
            user2_features['reputation_score'] > 0.8):
            reasons.append("Both have great reviews")
        
        return reasons[:3]  # Limit to top 3 reasons
    
    def get_match_recommendations(self, user_id: str, users_df: pd.DataFrame, 
                                interactions_df: pd.DataFrame, 
                                top_k: int = 5) -> List[Dict]:
        """Get top K match recommendations for a user"""
        
        if users_df.empty:
            return []
        
        # Find target user
        target_user_rows = users_df[users_df['user_id'] == user_id]
        if target_user_rows.empty:
            logger.warning(f"User {user_id} not found in users DataFrame")
            return []
        
        target_user = target_user_rows.iloc[0]
        target_features = self._extract_user_features(target_user, interactions_df)
        
        # Get users this user has already interacted with
        interacted_users = set()
        if not interactions_df.empty:
            user_interactions = interactions_df[interactions_df['user_id'] == user_id]
            interacted_users = set(user_interactions['target_user_id'].unique())
        
        # Filter potential matches
        potential_matches = users_df[
            (~users_df['user_id'].isin(interacted_users)) & 
            (users_df['user_id'] != user_id)
        ]
        
        if potential_matches.empty:
            return []
        
        recommendations = []
        
        for _, candidate in potential_matches.iterrows():
            try:
                candidate_features = self._extract_user_features(candidate, interactions_df)
                
                score = self.calculate_compatibility_score(target_features, candidate_features)
                
                # Convert pandas Series to dict for reason generation
                target_profile = target_user.to_dict() if hasattr(target_user, 'to_dict') else dict(target_user)
                candidate_profile = candidate.to_dict() if hasattr(candidate, 'to_dict') else dict(candidate)
                
                reasons = self._generate_match_reasons(
                    target_features, candidate_features, 
                    target_profile, candidate_profile
                )
                
                recommendations.append({
                    'user_id': candidate['user_id'],
                    'score': float(score),
                    'reasons': reasons,
                    'profile': {
                        'name': candidate.get('name', 'Unknown'),
                        'age': candidate.get('age', 25),
                        'photo': candidate.get('photos', [''])[0] if candidate.get('photos') else '',
                        'bio': candidate.get('bio', ''),
                        'interests': candidate.get('interests', []),
                        'coffee_preferences': candidate.get('coffee_preferences', []),
                        'personality_type': candidate.get('personality_type', '')
                    }
                })
            except Exception as e:
                logger.error(f"Error processing candidate {candidate.get('user_id', 'unknown')}: {str(e)}")
                continue
        
        # Sort by score and return top K
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:top_k]
    
    def train_feedback_model(self, feedback_df: pd.DataFrame, 
                           interactions_df: pd.DataFrame) -> Optional[RandomForestRegressor]:
        """Train model to predict match success based on feedback"""
        if feedback_df.empty:
            logger.warning("No feedback data available for training")
            return None
        
        try:
            # Prepare features from feedback data
            X, y = self._prepare_feedback_features(feedback_df, interactions_df)
            
            if len(X) < 10:  # Need minimum samples
                logger.warning("Insufficient feedback data for training")
                return None
            
            # Train Random Forest model
            self.feedback_model = RandomForestRegressor(
                n_estimators=100, 
                random_state=42,
                max_depth=10
            )
            self.feedback_model.fit(X, y)
            
            # Log performance
            score = self.feedback_model.score(X, y)
            logger.info(f"Feedback model trained with score: {score:.3f}")
            
            return self.feedback_model
            
        except Exception as e:
            logger.error(f"Error training feedback model: {str(e)}")
            return None
    
    def _prepare_feedback_features(self, feedback_df: pd.DataFrame, 
                                 interactions_df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features for feedback model training"""
        features = []
        targets = []
        
        for _, feedback in feedback_df.iterrows():
            # Extract compatibility features between users
            user1_id = feedback['user_id']
            user2_id = feedback['target_user_id']
            
            # Simple features for now - can be expanded
            feature_vector = [
                feedback.get('rating', 3.0),
                len(feedback.get('feedback_text', '')),
                1 if feedback.get('would_meet_again', False) else 0
            ]
            
            features.append(feature_vector)
            targets.append(feedback.get('rating', 3.0) / 5.0)  # Normalize to 0-1
        
        return np.array(features), np.array(targets)
    
    def save_model(self, filepath: str):
        """Save the trained models"""
        model_data = {
            'feedback_model': self.feedback_model,
            'personality_compatibility': self.personality_compatibility,
            'model_version': self.model_version,
            'coffee_types': self.coffee_types,
            'time_preferences': self.time_preferences
        }
        joblib.dump(model_data, filepath)
        logger.info(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str):
        """Load trained models"""
        try:
            model_data = joblib.load(filepath)
            self.feedback_model = model_data.get('feedback_model')
            self.personality_compatibility = model_data.get('personality_compatibility', self.personality_compatibility)
            self.model_version = model_data.get('model_version', 'v1.0')
            self.coffee_types = model_data.get('coffee_types', self.coffee_types)
            self.time_preferences = model_data.get('time_preferences', self.time_preferences)
            logger.info(f"Model loaded from {filepath}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")