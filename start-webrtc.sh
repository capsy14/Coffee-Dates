#!/bin/bash

# Coffee Dates WebRTC Setup Script
# This script helps you quickly set up and test the WebRTC implementation

echo "☕ Coffee Dates - WebRTC Video Call Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Navigate to backend
echo "📦 Setting up Backend..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

echo ""
echo "🚀 Starting Backend Server..."
echo "Backend will run on http://localhost:5000"
echo ""

# Start backend in background
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Navigate to client
cd ../client

echo ""
echo "📦 Setting up Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "🚀 Starting Frontend Server..."
echo "Frontend will run on http://localhost:3000"
echo ""
echo "================================================"
echo "✨ Setup Complete!"
echo "================================================"
echo ""
echo "📱 To test the video call:"
echo "   1. Open http://localhost:3000/video-call in two browser tabs"
echo "   2. Note your User ID in each tab"
echo "   3. In tab 2, enter tab 1's User ID"
echo "   4. Click 'Start Video Call'"
echo "   5. Accept the call in tab 1"
echo ""
echo "🛑 To stop servers:"
echo "   Press Ctrl+C and run: kill $BACKEND_PID"
echo ""
echo "================================================"

# Start frontend
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
