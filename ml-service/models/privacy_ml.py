import numpy as np
import pandas as pd
import hashlib
import hmac
import secrets
from typing import List, Dict, Tuple, Optional
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

class PrivacyPreservingML:
    """
    Privacy-preserving machine learning components for the Coffee Dating app.
    Implements differential privacy, homomorphic encryption-like operations,
    and federated learning capabilities.
    """
    
    def __init__(self, privacy_budget: float = 1.0):
        self.privacy_budget = privacy_budget
        self.epsilon = privacy_budget  # Differential privacy parameter
        self.secret_key = secrets.token_bytes(32)  # For HMAC operations
        
    def add_differential_privacy_noise(self, data: np.ndarray, 
                                     sensitivity: float = 1.0) -> np.ndarray:
        """
        Add Laplacian noise for differential privacy
        
        Args:
            data: Input data array
            sensitivity: Sensitivity of the query (max change in output)
            
        Returns:
            Data with added noise
        """
        if self.epsilon <= 0:
            logger.warning("Privacy budget exhausted, returning original data")
            return data
            
        # Calculate noise scale
        scale = sensitivity / self.epsilon
        
        # Add Laplacian noise
        noise = np.random.laplace(0, scale, data.shape)
        noisy_data = data + noise
        
        # Reduce privacy budget
        self.epsilon *= 0.9  # Consume some privacy budget
        
        return noisy_data
    
    def private_user_embedding(self, user_features: Dict) -> np.ndarray:
        """
        Generate privacy-preserving user embedding using local differential privacy
        
        Args:
            user_features: Dictionary of user features
            
        Returns:
            Private embedding vector
        """
        # Create base embedding from features
        embedding = []
        
        # Age (normalized and noisy)
        age_normalized = user_features.get('age', 25) / 100.0
        age_private = self.add_differential_privacy_noise(
            np.array([age_normalized]), sensitivity=0.01
        )[0]
        embedding.append(age_private)
        
        # Interests (binary vector with noise)
        interests = user_features.get('interests', [])
        interest_categories = [
            'travel', 'reading', 'sports', 'music', 'art', 'food', 
            'technology', 'nature', 'fitness', 'movies'
        ]
        
        interest_vector = [1 if interest in interests else 0 
                          for interest in interest_categories]
        interest_vector_private = self.add_differential_privacy_noise(
            np.array(interest_vector), sensitivity=1.0
        )
        embedding.extend(interest_vector_private)
        
        # Coffee preferences (binary vector with noise)
        coffee_prefs = user_features.get('coffee_preferences', [])
        coffee_types = ['Espresso', 'Cappuccino', 'Latte', 'Americano', 'Mocha']
        
        coffee_vector = [1 if coffee in coffee_prefs else 0 
                        for coffee in coffee_types]
        coffee_vector_private = self.add_differential_privacy_noise(
            np.array(coffee_vector), sensitivity=1.0
        )
        embedding.extend(coffee_vector_private)
        
        return np.array(embedding)
    
    def secure_similarity_computation(self, embedding1: np.ndarray, 
                                    embedding2: np.ndarray) -> float:
        """
        Compute similarity between embeddings using privacy-preserving techniques
        
        Args:
            embedding1: First user's private embedding
            embedding2: Second user's private embedding
            
        Returns:
            Privacy-preserving similarity score
        """
        # Add noise to the similarity computation
        similarity = cosine_similarity([embedding1], [embedding2])[0][0]
        
        # Add calibrated noise for differential privacy
        noisy_similarity = self.add_differential_privacy_noise(
            np.array([similarity]), sensitivity=2.0  # Cosine similarity has sensitivity 2
        )[0]
        
        # Clip to valid range [0, 1]
        return max(0.0, min(1.0, noisy_similarity))
    
    def hash_user_id(self, user_id: str) -> str:
        """
        Create privacy-preserving hash of user ID using HMAC
        
        Args:
            user_id: Original user ID
            
        Returns:
            Hashed user ID
        """
        return hmac.new(
            self.secret_key, 
            user_id.encode('utf-8'), 
            hashlib.sha256
        ).hexdigest()[:16]  # Truncate for storage efficiency
    
    def anonymize_feedback(self, feedback_data: Dict) -> Dict:
        """
        Anonymize feedback data while preserving utility
        
        Args:
            feedback_data: Original feedback dictionary
            
        Returns:
            Anonymized feedback
        """
        anonymized = feedback_data.copy()
        
        # Hash user IDs
        anonymized['user_id'] = self.hash_user_id(feedback_data['user_id'])
        anonymized['target_user_id'] = self.hash_user_id(feedback_data['target_user_id'])
        
        # Add noise to rating
        if 'rating' in anonymized:
            rating_noisy = self.add_differential_privacy_noise(
                np.array([anonymized['rating']]), sensitivity=1.0
            )[0]
            anonymized['rating'] = max(1.0, min(5.0, rating_noisy))
        
        # Remove or generalize sensitive text
        if 'feedback_text' in anonymized:
            # Simple text anonymization (in production, use more sophisticated NLP)
            text = anonymized['feedback_text']
            # Remove names, emails, phone numbers with regex
            import re
            text = re.sub(r'\b[A-Za-z]+\b', '[NAME]', text)  # Simple name removal
            text = re.sub(r'\b[\w.-]+@[\w.-]+\.\w+\b', '[EMAIL]', text)
            text = re.sub(r'\b\d{3}-\d{3}-\d{4}\b', '[PHONE]', text)
            anonymized['feedback_text'] = text
        
        return anonymized
    
    def federated_gradient_aggregation(self, gradients_list: List[np.ndarray]) -> np.ndarray:
        """
        Aggregate gradients from multiple users for federated learning
        
        Args:
            gradients_list: List of gradient arrays from different users
            
        Returns:
            Aggregated gradient with privacy protection
        """
        if not gradients_list:
            return np.array([])
        
        # Simple federated averaging
        avg_gradient = np.mean(gradients_list, axis=0)
        
        # Add differential privacy noise to the aggregated gradient
        private_gradient = self.add_differential_privacy_noise(
            avg_gradient, sensitivity=1.0
        )
        
        return private_gradient
    
    def k_anonymity_check(self, user_data: pd.DataFrame, k: int = 5) -> bool:
        """
        Check if dataset satisfies k-anonymity
        
        Args:
            user_data: DataFrame with user information
            k: Minimum group size for k-anonymity
            
        Returns:
            True if k-anonymity is satisfied
        """
        # Define quasi-identifiers
        quasi_identifiers = ['age_group', 'location_city', 'gender']
        
        # Create age groups for better anonymity
        if 'age' in user_data.columns:
            user_data = user_data.copy()
            user_data['age_group'] = pd.cut(
                user_data['age'], 
                bins=[0, 25, 35, 45, 100], 
                labels=['18-25', '26-35', '36-45', '46+']
            )
        
        # Check group sizes
        available_cols = [col for col in quasi_identifiers if col in user_data.columns]
        
        if not available_cols:
            return True  # No quasi-identifiers to check
        
        group_sizes = user_data.groupby(available_cols).size()
        min_group_size = group_sizes.min()
        
        return min_group_size >= k
    
    def generate_synthetic_data(self, original_data: pd.DataFrame, 
                              num_synthetic: int = 100) -> pd.DataFrame:
        """
        Generate synthetic data that preserves statistical properties
        while protecting individual privacy
        
        Args:
            original_data: Original dataset
            num_synthetic: Number of synthetic records to generate
            
        Returns:
            Synthetic dataset
        """
        synthetic_records = []
        
        for _ in range(num_synthetic):
            # Sample from original distributions with noise
            synthetic_record = {}
            
            for column in original_data.columns:
                if column in ['age']:
                    # Numerical columns: add noise to sampled values
                    sampled_value = original_data[column].sample(1).iloc[0]
                    noisy_value = self.add_differential_privacy_noise(
                        np.array([sampled_value]), sensitivity=1.0
                    )[0]
                    synthetic_record[column] = max(18, min(80, int(noisy_value)))
                    
                elif column in ['interests', 'coffee_preferences']:
                    # List columns: sample and shuffle
                    all_values = []
                    for val_list in original_data[column]:
                        if isinstance(val_list, list):
                            all_values.extend(val_list)
                    
                    if all_values:
                        # Sample random subset
                        num_items = min(len(set(all_values)), 
                                      np.random.randint(1, 6))
                        synthetic_record[column] = list(
                            np.random.choice(list(set(all_values)), num_items, replace=False)
                        )
                    else:
                        synthetic_record[column] = []
                        
                else:
                    # Categorical columns: sample with some probability modification
                    value_counts = original_data[column].value_counts(normalize=True)
                    
                    # Add small amount of noise to probabilities
                    noisy_probs = value_counts.values + np.random.laplace(
                        0, 0.01, len(value_counts)
                    )
                    noisy_probs = np.maximum(noisy_probs, 0)  # Ensure non-negative
                    noisy_probs = noisy_probs / noisy_probs.sum()  # Normalize
                    
                    synthetic_record[column] = np.random.choice(
                        value_counts.index, p=noisy_probs
                    )
            
            synthetic_records.append(synthetic_record)
        
        return pd.DataFrame(synthetic_records)


class FederatedMatchmaker:
    """
    Federated learning-compatible matchmaking system
    """
    
    def __init__(self):
        self.privacy_ml = PrivacyPreservingML()
        self.local_models = {}  # Store user-specific model parameters
        
    def local_training(self, user_id: str, user_data: Dict, 
                      interactions: List[Dict]) -> np.ndarray:
        """
        Perform local training on user's device/client
        
        Args:
            user_id: User identifier
            user_data: User's personal data
            interactions: User's interaction history
            
        Returns:
            Local model gradients (privacy-preserving)
        """
        # Generate private user embedding
        user_embedding = self.privacy_ml.private_user_embedding(user_data)
        
        # Compute local gradients based on interactions
        gradients = []
        
        for interaction in interactions:
            # Simple gradient computation (in practice, use more sophisticated methods)
            if interaction.get('interaction_type') == 'like':
                # Positive feedback
                gradient = user_embedding * 0.1
            elif interaction.get('interaction_type') == 'pass':
                # Negative feedback
                gradient = user_embedding * -0.05
            else:
                gradient = np.zeros_like(user_embedding)
            
            gradients.append(gradient)
        
        if gradients:
            local_gradient = np.mean(gradients, axis=0)
        else:
            local_gradient = np.zeros_like(user_embedding)
        
        # Add differential privacy noise
        private_gradient = self.privacy_ml.add_differential_privacy_noise(
            local_gradient, sensitivity=0.1
        )
        
        return private_gradient
    
    def aggregate_federated_updates(self, gradient_updates: List[Tuple[str, np.ndarray]]) -> Dict:
        """
        Aggregate model updates from multiple users
        
        Args:
            gradient_updates: List of (user_id, gradient) tuples
            
        Returns:
            Global model update
        """
        if not gradient_updates:
            return {}
        
        # Extract gradients
        gradients = [grad for _, grad in gradient_updates]
        
        # Federated averaging with privacy protection
        global_gradient = self.privacy_ml.federated_gradient_aggregation(gradients)
        
        return {
            'global_gradient': global_gradient,
            'num_participants': len(gradient_updates),
            'privacy_budget_consumed': self.privacy_ml.epsilon
        }
    
    def privacy_preserving_recommendation(self, user_id: str, 
                                        candidate_embeddings: List[np.ndarray]) -> List[float]:
        """
        Generate recommendations using privacy-preserving similarity computation
        
        Args:
            user_id: User requesting recommendations
            candidate_embeddings: List of candidate user embeddings
            
        Returns:
            List of compatibility scores
        """
        # Get user's private embedding (this would be computed locally)
        user_data = self.local_models.get(user_id, {})
        if not user_data:
            # Return random scores if no user data
            return [np.random.random() for _ in candidate_embeddings]
        
        user_embedding = self.privacy_ml.private_user_embedding(user_data)
        
        # Compute private similarities
        similarities = []
        for candidate_embedding in candidate_embeddings:
            similarity = self.privacy_ml.secure_similarity_computation(
                user_embedding, candidate_embedding
            )
            similarities.append(similarity)
        
        return similarities