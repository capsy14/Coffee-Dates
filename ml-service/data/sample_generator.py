import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from typing import List, Dict
from faker import Faker
from schemas import User, UserProfile, Location, Interaction, Feedback, InteractionTypeEnum, GenderEnum, TimePreferenceEnum

fake = Faker()
Faker.seed(42)
random.seed(42)
np.random.seed(42)

class SampleDataGenerator:
    def __init__(self):
        self.coffee_types = ['Espresso', 'Cappuccino', 'Latte', 'Americano', 'Mocha', 'Macchiato', 'Cold Brew', 'Turkish Coffee']
        self.interests = [
            'travel', 'reading', 'photography', 'cooking', 'music', 'movies', 'fitness', 'yoga',
            'hiking', 'art', 'dancing', 'gaming', 'sports', 'meditation', 'writing', 'cycling',
            'swimming', 'rock climbing', 'painting', 'coding', 'astronomy', 'poetry', 'theater',
            'wine tasting', 'food blogging', 'fashion', 'gardening', 'volunteering', 'learning languages'
        ]
        self.personalities = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                            'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
        self.cities = [
            {'name': 'New York', 'lat': 40.7128, 'lng': -74.0060},
            {'name': 'Los Angeles', 'lat': 34.0522, 'lng': -118.2437},
            {'name': 'Chicago', 'lat': 41.8781, 'lng': -87.6298},
            {'name': 'Houston', 'lat': 29.7604, 'lng': -95.3698},
            {'name': 'San Francisco', 'lat': 37.7749, 'lng': -122.4194},
            {'name': 'Boston', 'lat': 42.3601, 'lng': -71.0589},
            {'name': 'Seattle', 'lat': 47.6062, 'lng': -122.3321},
            {'name': 'Miami', 'lat': 25.7617, 'lng': -80.1918},
            {'name': 'Austin', 'lat': 30.2672, 'lng': -97.7431},
            {'name': 'Portland', 'lat': 45.5152, 'lng': -122.6784}
        ]
        
    def generate_users(self, num_users: int = 1000) -> List[Dict]:
        """Generate diverse sample user data"""
        users = []
        
        for i in range(num_users):
            # Basic demographics with realistic distribution
            age = int(np.random.normal(28, 6))  # Normal distribution around 28
            age = max(18, min(65, age))  # Clamp to reasonable range
            
            gender = np.random.choice([GenderEnum.male, GenderEnum.female], p=[0.52, 0.48])
            
            # Location
            city = random.choice(self.cities)
            location = Location(
                latitude=city['lat'] + np.random.normal(0, 0.1),
                longitude=city['lng'] + np.random.normal(0, 0.1),
                city=city['name'],
                country="USA"
            )
            
            # Interests (2-8 interests per person)
            num_interests = random.randint(2, 8)
            user_interests = random.sample(self.interests, num_interests)
            
            # Coffee preferences (1-3 types)
            num_coffee = random.randint(1, 3)
            coffee_prefs = random.sample(self.coffee_types, num_coffee)
            
            # Personality type
            personality = random.choice(self.personalities)
            
            # Time preference based on age and personality
            if age < 25:
                time_pref = np.random.choice(['afternoon', 'evening'], p=[0.3, 0.7])
            elif age > 35:
                time_pref = np.random.choice(['morning', 'afternoon', 'evening'], p=[0.4, 0.4, 0.2])
            else:
                time_pref = np.random.choice(['morning', 'afternoon', 'evening'], p=[0.2, 0.3, 0.5])
            
            # Generate bio
            bio_templates = [
                f"Love {random.choice(user_interests)} and great {random.choice(coffee_prefs)}. Looking for meaningful connections!",
                f"Passionate about {random.choice(user_interests)}. Coffee enthusiast who believes the best conversations happen over {random.choice(coffee_prefs)}.",
                f"{random.choice(user_interests).title()} lover seeking someone to share adventures with. Let's grab {random.choice(coffee_prefs)} and see where it goes!",
                f"Life is too short for bad coffee and boring conversations. I'm into {', '.join(user_interests[:2])} and always up for trying new things.",
                f"Professional by day, {random.choice(user_interests)} enthusiast by night. Let's connect over {random.choice(coffee_prefs)}!"
            ]
            
            profile = UserProfile(
                name=fake.first_name(),
                age=age,
                gender=gender,
                location=location,
                bio=random.choice(bio_templates),
                interests=user_interests,
                personality_type=personality,
                coffee_preferences=coffee_prefs,
                date_time_preference=TimePreferenceEnum(time_pref),
                photos=[f"https://picsum.photos/400/400?random={i}"],
                created_at=fake.date_time_between(start_date='-2y', end_date='now'),
                last_active=fake.date_time_between(start_date='-30d', end_date='now')
            )
            
            # Reputation based on personality and age
            base_reputation = 0.5
            if personality[0] == 'E':  # Extroverts tend to get better reviews
                base_reputation += 0.1
            if age > 25:  # Older users tend to be more reliable
                base_reputation += 0.1
            
            reputation = min(1.0, max(0.1, np.random.normal(base_reputation, 0.15)))
            
            user = {
                'user_id': f"user_{i+1:04d}",
                'profile': profile.dict(),
                'preferences': {
                    'age_range': {'min': max(18, age-8), 'max': min(65, age+8)},
                    'max_distance': random.randint(10, 50),
                    'preferred_genders': [gender.value] if gender != GenderEnum.non_binary else ['male', 'female'],
                    'dealbreakers': []
                },
                'blockchain_data': {
                    'wallet_address': f"0x{fake.hex_color()[1:]}{''.join(random.choices('0123456789abcdef', k=34))}",
                    'reputation_score': reputation,
                    'total_matches': random.randint(0, 50),
                    'successful_dates': random.randint(0, 20),
                    'tokens_earned': random.randint(0, 1000)
                },
                'is_active': random.choice([True, False], p=[0.8, 0.2]),
                'is_verified': random.choice([True, False], p=[0.6, 0.4]),
                'premium_user': random.choice([True, False], p=[0.2, 0.8])
            }
            
            users.append(user)
        
        return users
    
    def generate_interactions(self, users: List[Dict], num_interactions: int = 5000) -> List[Dict]:
        """Generate realistic interaction data"""
        interactions = []
        user_ids = [user['user_id'] for user in users]
        
        # Create interaction patterns based on user characteristics
        for _ in range(num_interactions):
            user1 = random.choice(users)
            user2 = random.choice(users)
            
            # Avoid self-interactions
            if user1['user_id'] == user2['user_id']:
                continue
            
            # Calculate interaction probability based on compatibility
            compatibility = self._calculate_simple_compatibility(user1, user2)
            
            # Higher compatibility = more likely to interact positively
            if compatibility < 0.3:
                interaction_type = np.random.choice(
                    [InteractionTypeEnum.view, InteractionTypeEnum.pass], 
                    p=[0.7, 0.3]
                )
            elif compatibility < 0.6:
                interaction_type = np.random.choice(
                    [InteractionTypeEnum.view, InteractionTypeEnum.like, InteractionTypeEnum.pass], 
                    p=[0.4, 0.4, 0.2]
                )
            else:
                interaction_type = np.random.choice(
                    [InteractionTypeEnum.view, InteractionTypeEnum.like, InteractionTypeEnum.super_like, InteractionTypeEnum.match], 
                    p=[0.2, 0.5, 0.1, 0.2]
                )
            
            # Generate metadata based on interaction type
            metadata = {}
            if interaction_type in [InteractionTypeEnum.view]:
                metadata['duration'] = random.randint(2, 30)  # seconds
                metadata['swipe_speed'] = random.uniform(1, 10)
            elif interaction_type in [InteractionTypeEnum.chat]:
                metadata['message_count'] = random.randint(1, 50)
                metadata['duration'] = random.randint(60, 3600)  # 1 min to 1 hour
            elif interaction_type in [InteractionTypeEnum.video_call]:
                metadata['duration'] = random.randint(300, 7200)  # 5 min to 2 hours
            
            metadata['session_id'] = fake.uuid4()
            metadata['device_type'] = random.choice(['mobile', 'web', 'tablet'])
            
            interaction = {
                'user_id': user1['user_id'],
                'target_user_id': user2['user_id'],
                'interaction_type': interaction_type.value,
                'timestamp': fake.date_time_between(start_date='-1y', end_date='now'),
                'metadata': metadata
            }
            
            interactions.append(interaction)
        
        return interactions
    
    def generate_feedback(self, users: List[Dict], interactions: List[Dict], 
                         num_feedback: int = 500) -> List[Dict]:
        """Generate realistic feedback data"""
        feedback_list = []
        
        # Find successful interactions (matches, chats, calls)
        successful_interactions = [
            i for i in interactions 
            if i['interaction_type'] in ['match', 'chat', 'video_call']
        ]
        
        # Generate feedback for a subset of successful interactions
        for _ in range(min(num_feedback, len(successful_interactions))):
            interaction = random.choice(successful_interactions)
            
            user1_id = interaction['user_id']
            user2_id = interaction['target_user_id']
            
            # Find user data
            user1 = next((u for u in users if u['user_id'] == user1_id), None)
            user2 = next((u for u in users if u['user_id'] == user2_id), None)
            
            if not user1 or not user2:
                continue
            
            # Calculate expected rating based on compatibility
            compatibility = self._calculate_simple_compatibility(user1, user2)
            
            # Generate rating with some noise
            base_rating = 1 + (compatibility * 4)  # Scale to 1-5
            rating = max(1, min(5, np.random.normal(base_rating, 0.8)))
            
            # Generate feedback text
            if rating >= 4:
                feedback_texts = [
                    "Great conversation and wonderful person!",
                    "Had an amazing time! Would definitely meet again.",
                    "Really enjoyed our coffee date. Great chemistry!",
                    "Fantastic person with great energy.",
                    "Everything I was hoping for and more!"
                ]
            elif rating >= 3:
                feedback_texts = [
                    "Nice person, decent conversation.",
                    "Pleasant date, though not much spark.",
                    "Good coffee, okay company.",
                    "Nice enough, but not really my type.",
                    "Enjoyable but nothing special."
                ]
            else:
                feedback_texts = [
                    "Not really a good match for me.",
                    "Conversation was a bit awkward.",
                    "Didn't really click unfortunately.",
                    "Not what I was expecting.",
                    "Probably won't meet again."
                ]
            
            feedback = {
                'user_id': user1_id,
                'target_user_id': user2_id,
                'date_id': fake.uuid4(),
                'rating': rating,
                'feedback_text': random.choice(feedback_texts),
                'feedback_categories': random.sample(['conversation', 'punctuality', 'appearance', 'personality'], 
                                                   random.randint(1, 3)),
                'would_meet_again': rating >= 3.5,
                'timestamp': fake.date_time_between(start_date='-6m', end_date='now'),
                'is_anonymous': random.choice([True, False], p=[0.8, 0.2])
            }
            
            feedback_list.append(feedback)
        
        return feedback_list
    
    def _calculate_simple_compatibility(self, user1: Dict, user2: Dict) -> float:
        """Simple compatibility calculation for data generation"""
        score = 0.5  # Base score
        
        # Age compatibility
        age_diff = abs(user1['profile']['age'] - user2['profile']['age'])
        age_score = max(0, 1 - age_diff / 15)
        score += age_score * 0.2
        
        # Interest overlap
        interests1 = set(user1['profile']['interests'])
        interests2 = set(user2['profile']['interests'])
        interest_overlap = len(interests1 & interests2) / max(len(interests1 | interests2), 1)
        score += interest_overlap * 0.3
        
        # Coffee preference overlap
        coffee1 = set(user1['profile']['coffee_preferences'])
        coffee2 = set(user2['profile']['coffee_preferences'])
        coffee_overlap = len(coffee1 & coffee2) / max(len(coffee1 | coffee2), 1)
        score += coffee_overlap * 0.2
        
        # Time preference match
        if user1['profile']['date_time_preference'] == user2['profile']['date_time_preference']:
            score += 0.1
        
        # Location proximity (simplified)
        lat_diff = abs(user1['profile']['location']['latitude'] - user2['profile']['location']['latitude'])
        lng_diff = abs(user1['profile']['location']['longitude'] - user2['profile']['location']['longitude'])
        location_score = max(0, 1 - (lat_diff + lng_diff) / 2)
        score += location_score * 0.1
        
        return min(1.0, max(0.0, score))
    
    def generate_complete_dataset(self, num_users: int = 1000, 
                                num_interactions: int = 5000,
                                num_feedback: int = 500) -> Dict[str, List[Dict]]:
        """Generate complete dataset with users, interactions, and feedback"""
        print(f"Generating {num_users} users...")
        users = self.generate_users(num_users)
        
        print(f"Generating {num_interactions} interactions...")
        interactions = self.generate_interactions(users, num_interactions)
        
        print(f"Generating {num_feedback} feedback entries...")
        feedback = self.generate_feedback(users, interactions, num_feedback)
        
        return {
            'users': users,
            'interactions': interactions,
            'feedback': feedback
        }
    
    def save_to_json(self, data: Dict[str, List[Dict]], base_path: str = "sample_data"):
        """Save generated data to JSON files"""
        import json
        import os
        
        os.makedirs(base_path, exist_ok=True)
        
        for collection_name, collection_data in data.items():
            file_path = os.path.join(base_path, f"{collection_name}.json")
            with open(file_path, 'w') as f:
                json.dump(collection_data, f, indent=2, default=str)
            print(f"Saved {len(collection_data)} {collection_name} to {file_path}")

if __name__ == "__main__":
    generator = SampleDataGenerator()
    data = generator.generate_complete_dataset(
        num_users=1000,
        num_interactions=5000,
        num_feedback=500
    )
    generator.save_to_json(data)