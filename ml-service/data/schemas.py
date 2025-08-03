from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    non_binary = "non_binary"
    other = "other"

class InteractionTypeEnum(str, Enum):
    view = "view"
    like = "like"
    pass = "pass"
    match = "match"
    chat = "chat"
    video_call = "video_call"
    super_like = "super_like"

class TimePreferenceEnum(str, Enum):
    morning = "morning"
    afternoon = "afternoon"
    evening = "evening"

class Location(BaseModel):
    latitude: float
    longitude: float
    city: str
    country: Optional[str] = "Unknown"

class UserPreferences(BaseModel):
    age_range: Dict[str, int] = Field(default={"min": 18, "max": 80})
    max_distance: int = Field(default=50, ge=1, le=500)  # km
    preferred_genders: List[GenderEnum] = Field(default=[])
    dealbreakers: List[str] = Field(default=[])

class BlockchainData(BaseModel):
    wallet_address: Optional[str] = None
    reputation_score: float = Field(default=0.5, ge=0.0, le=1.0)
    total_matches: int = Field(default=0, ge=0)
    successful_dates: int = Field(default=0, ge=0)
    tokens_earned: int = Field(default=0, ge=0)

class UserProfile(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=18, le=100)
    gender: GenderEnum
    location: Location
    bio: str = Field(default="", max_length=500)
    interests: List[str] = Field(default=[])
    personality_type: str = Field(default="", regex="^[EINTFPJS]{4}$|^$")
    coffee_preferences: List[str] = Field(default=[])
    date_time_preference: TimePreferenceEnum = TimePreferenceEnum.evening
    photos: List[str] = Field(default=[])
    created_at: datetime = Field(default_factory=datetime.now)
    last_active: datetime = Field(default_factory=datetime.now)

class User(BaseModel):
    user_id: str = Field(..., min_length=1)
    profile: UserProfile
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    blockchain_data: BlockchainData = Field(default_factory=BlockchainData)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    premium_user: bool = Field(default=False)

class InteractionMetadata(BaseModel):
    duration: Optional[int] = None  # seconds
    message_count: Optional[int] = None
    swipe_speed: Optional[float] = None  # seconds taken to decide
    session_id: Optional[str] = None
    device_type: Optional[str] = None

class Interaction(BaseModel):
    user_id: str
    target_user_id: str
    interaction_type: InteractionTypeEnum
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: InteractionMetadata = Field(default_factory=InteractionMetadata)

class FeedbackCategories(str, Enum):
    conversation = "conversation"
    punctuality = "punctuality"
    appearance = "appearance"
    personality = "personality"
    overall = "overall"
    safety = "safety"

class Feedback(BaseModel):
    user_id: str
    target_user_id: str
    date_id: Optional[str] = None
    rating: float = Field(..., ge=1.0, le=5.0)
    feedback_text: str = Field(default="", max_length=1000)
    feedback_categories: List[FeedbackCategories] = Field(default=[])
    would_meet_again: bool = Field(default=False)
    timestamp: datetime = Field(default_factory=datetime.now)
    is_anonymous: bool = Field(default=True)

class MatchSuggestion(BaseModel):
    user_id: str
    score: float = Field(..., ge=0.0, le=1.0)
    reasons: List[str] = Field(default=[])
    model_version: str = Field(default="v1.0")
    generated_at: datetime = Field(default_factory=datetime.now)

class MLPrediction(BaseModel):
    user_id: str
    suggested_matches: List[MatchSuggestion] = Field(default=[])
    feedback_received: List[Dict[str, Any]] = Field(default=[])
    last_updated: datetime = Field(default_factory=datetime.now)

# API Models
class MatchRequest(BaseModel):
    user_id: str
    top_k: int = Field(default=5, ge=1, le=20)
    include_reasons: bool = Field(default=True)
    filters: Optional[Dict[str, Any]] = None

class MatchProfile(BaseModel):
    name: str
    age: int
    photo: str
    bio: str
    interests: List[str]
    coffee_preferences: List[str]
    personality_type: str
    distance: Optional[float] = None

class MatchResponse(BaseModel):
    user_id: str
    score: float
    reasons: List[str]
    profile: MatchProfile

class FeedbackRequest(BaseModel):
    user_id: str
    target_user_id: str
    action: str  # "accepted", "skipped", "matched", "super_liked"
    interaction_context: Optional[str] = None

class ModelStatsResponse(BaseModel):
    model_version: str
    total_users: int
    total_interactions: int
    total_feedback: int
    accuracy_metrics: Dict[str, float]
    last_training: Optional[datetime] = None

class HealthResponse(BaseModel):
    status: str
    model_version: str
    uptime: str
    database_connected: bool
    model_loaded: bool

# Sample data generation models
class SampleDataConfig(BaseModel):
    num_users: int = Field(default=1000, ge=10, le=10000)
    num_interactions: int = Field(default=5000, ge=100, le=50000)
    num_feedback: int = Field(default=500, ge=10, le=5000)
    include_diversity: bool = Field(default=True)
    seed: Optional[int] = None

# MongoDB collection names
class Collections:
    USERS = "users"
    INTERACTIONS = "interactions"
    FEEDBACK = "feedback"
    ML_PREDICTIONS = "ml_predictions"
    MODEL_METRICS = "model_metrics"