@echo off
REM Coffee Dates WebRTC Setup Script for Windows
REM This script helps you quickly set up and test the WebRTC implementation

echo ☕ Coffee Dates - WebRTC Video Call Setup
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js is installed: %NODE_VERSION%
echo.

REM Navigate to backend
echo 📦 Setting up Backend...
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

echo.
echo 🚀 Starting Backend Server...
echo Backend will run on http://localhost:5000
echo.

REM Start backend in new window
start "Coffee Dates Backend" cmd /k "npm start"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Navigate to client
cd ..\client

echo.
echo 📦 Setting up Frontend...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo 🚀 Starting Frontend Server...
echo Frontend will run on http://localhost:3000
echo.
echo ================================================
echo ✨ Setup Complete!
echo ================================================
echo.
echo 📱 To test the video call:
echo    1. Open http://localhost:3000/video-call in two browser tabs
echo    2. Note your User ID in each tab
echo    3. In tab 2, enter tab 1's User ID
echo    4. Click 'Start Video Call'
echo    5. Accept the call in tab 1
echo.
echo 🛑 To stop servers:
echo    Close the terminal windows
echo.
echo ================================================
echo.

REM Start frontend
call npm start

pause
