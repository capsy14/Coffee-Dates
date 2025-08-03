// MongoDB initialization script
db = db.getSiblingDB('coffee_dates');

// Create collections
db.createCollection('users');
db.createCollection('interactions');
db.createCollection('feedback');
db.createCollection('ml_predictions');
db.createCollection('model_metrics');

// Create indexes for better performance
print('Creating indexes...');

// Users collection indexes
db.users.createIndex({ "user_id": 1 }, { unique: true });
db.users.createIndex({ "profile.location.latitude": 1, "profile.location.longitude": 1 });
db.users.createIndex({ "profile.age": 1 });
db.users.createIndex({ "profile.gender": 1 });
db.users.createIndex({ "is_active": 1 });
db.users.createIndex({ "profile.interests": 1 });
db.users.createIndex({ "profile.coffee_preferences": 1 });

// Interactions collection indexes
db.interactions.createIndex({ "user_id": 1, "target_user_id": 1 });
db.interactions.createIndex({ "timestamp": 1 });
db.interactions.createIndex({ "interaction_type": 1 });
db.interactions.createIndex({ "user_id": 1, "timestamp": -1 });

// Feedback collection indexes
db.feedback.createIndex({ "user_id": 1, "target_user_id": 1 });
db.feedback.createIndex({ "rating": 1 });
db.feedback.createIndex({ "timestamp": 1 });
db.feedback.createIndex({ "would_meet_again": 1 });

// ML Predictions collection indexes
db.ml_predictions.createIndex({ "user_id": 1 }, { unique: true });
db.ml_predictions.createIndex({ "generated_at": 1 });
db.ml_predictions.createIndex({ "model_version": 1 });

// Model metrics collection indexes
db.model_metrics.createIndex({ "timestamp": 1 });
db.model_metrics.createIndex({ "model_version": 1 });

print('Database initialization completed!');

// Create a sample admin user for testing
db.users.insertOne({
  user_id: "admin_user",
  profile: {
    name: "Admin User",
    age: 30,
    gender: "other",
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      city: "New York",
      country: "USA"
    },
    bio: "System administrator for Coffee Dates ML",
    interests: ["technology", "coffee", "data science"],
    personality_type: "INTJ",
    coffee_preferences: ["Espresso", "Cold Brew"],
    date_time_preference: "evening",
    photos: [],
    created_at: new Date(),
    last_active: new Date()
  },
  preferences: {
    age_range: { min: 18, max: 80 },
    max_distance: 50,
    preferred_genders: ["male", "female", "non_binary"],
    dealbreakers: []
  },
  blockchain_data: {
    wallet_address: "0x0000000000000000000000000000000000000000",
    reputation_score: 1.0,
    total_matches: 0,
    successful_dates: 0,
    tokens_earned: 1000
  },
  is_active: true,
  is_verified: true,
  premium_user: true
});

print('Sample admin user created!');

// Insert model performance metrics
db.model_metrics.insertOne({
  model_version: "v1.0",
  timestamp: new Date(),
  metrics: {
    precision: 0.75,
    recall: 0.68,
    f1_score: 0.71,
    user_satisfaction: 0.82,
    total_predictions: 0,
    successful_matches: 0,
    training_samples: 0
  },
  training_info: {
    training_date: new Date(),
    training_duration_minutes: 0,
    data_quality_score: 0.85,
    model_complexity: "medium"
  }
});

print('Initial model metrics inserted!');

// Create compound indexes for complex queries
db.users.createIndex({ 
  "profile.age": 1, 
  "profile.gender": 1, 
  "profile.location.city": 1 
});

db.interactions.createIndex({ 
  "user_id": 1, 
  "interaction_type": 1, 
  "timestamp": -1 
});

print('Compound indexes created!');

print('MongoDB initialization script completed successfully!');