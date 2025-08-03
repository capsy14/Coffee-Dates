# 🚀 Coffee Dates ML Setup Guide

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
# Install Docker and Docker Compose if not already installed
# On macOS with Homebrew:
brew install docker docker-compose

# On Ubuntu/Debian:
sudo apt-get update
sudo apt-get install docker.io docker-compose

# On Windows: Download Docker Desktop from docker.com
```

### 2. Start ML Service
```bash
# Make the script executable and run it
chmod +x run-ml-service.sh
./run-ml-service.sh start
```

### 3. Start React App
```bash
# In another terminal, start your React app
cd client
npm start
```

Now visit `http://localhost:3000/ml-matches` to see the AI Matchmaker! 🤖

## What the Setup Script Does

The `run-ml-service.sh` script automatically:

1. ✅ **Checks Dependencies** - Verifies Docker is installed
2. ✅ **Generates Sample Data** - Creates 1000 diverse user profiles
3. ✅ **Starts Services** - MongoDB, ML API, Redis, Nginx
4. ✅ **Loads Data** - Populates database with sample users
5. ✅ **Tests Everything** - Verifies all endpoints work
6. ✅ **Shows Status** - Displays URLs and next steps

## Service URLs

Once running, you can access:

- 🤖 **ML API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs  
- 🏥 **Health Check**: http://localhost:8000/health
- 📊 **Stats**: http://localhost:8000/stats
- 🗄️ **MongoDB**: localhost:27017
- 🔄 **Redis**: localhost:6379

## Troubleshooting

### "ML service is not running"
```bash
# Check if services are running
docker-compose -f docker-compose.ml.yml ps

# If not running, start them
./run-ml-service.sh start

# Check logs for errors
./run-ml-service.sh logs
```

### "User is not defined" Error
This is fixed! The app now:
- Uses Redux to get user data properly
- Provides fallback user IDs for demo mode
- Shows loading states while user data loads

### Port Already in Use
```bash
# Stop existing services
./run-ml-service.sh stop

# Or kill specific ports
sudo lsof -t -i tcp:8000 | xargs kill -9
sudo lsof -t -i tcp:27017 | xargs kill -9
```

### Database Connection Issues
```bash
# Check MongoDB is running
docker-compose -f docker-compose.ml.yml logs mongo

# Restart just MongoDB
docker-compose -f docker-compose.ml.yml restart mongo
```

## Testing the ML Features

### 1. Basic Health Check
```bash
curl http://localhost:8000/health
```

### 2. Get Sample Recommendations
```bash
curl -X POST http://localhost:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_0001", "top_k": 5}'
```

### 3. View Model Statistics
```bash
curl http://localhost:8000/stats
```

## Available Commands

```bash
# Start all services
./run-ml-service.sh start

# Stop all services  
./run-ml-service.sh stop

# Restart services
./run-ml-service.sh restart

# View logs
./run-ml-service.sh logs

# Check status
./run-ml-service.sh status

# Test endpoints
./run-ml-service.sh test
```

## Environment Variables

Create `.env` file with:
```bash
REACT_APP_ML_API_URL=http://localhost:8000
```

## Features Overview

### 🧠 Smart Matching
- **Hybrid Algorithm**: Content + collaborative filtering
- **Personality Types**: MBTI compatibility matrix
- **Coffee Preferences**: Specialized coffee matching
- **Location Aware**: Distance-based filtering

### 🔒 Privacy Protection
- **Differential Privacy**: Adds noise to protect individual data
- **Data Anonymization**: Hashes sensitive information
- **Federated Learning**: Optional decentralized training

### 📱 User Experience
- **Real-time Suggestions**: Instant match recommendations
- **Compatibility Explanations**: Shows why users match
- **Beautiful UI**: Coffee-themed responsive design
- **Continuous Learning**: Improves from user feedback

## Sample Data

The system generates 1000 diverse users with:
- ✅ Realistic age distributions (18-65)
- ✅ Various personality types (MBTI)
- ✅ Different coffee preferences
- ✅ Diverse interests and locations
- ✅ Simulated interaction history

## Next Steps

1. **Customize Matching Logic**: Edit `ml-service/models/matchmaker.py`
2. **Add New Features**: Extend the API in `ml-service/api/main.py`
3. **Improve UI**: Modify React components in `client/src/components/ml/`
4. **Production Deploy**: Use the Docker configurations provided

## Need Help?

- 📖 Check the full README: `ml-service/README.md`
- 🐛 Report issues: Create GitHub issues
- 💬 Ask questions: Check our documentation

Happy matching! ☕💕