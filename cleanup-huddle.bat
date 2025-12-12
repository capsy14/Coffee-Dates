@echo off
REM Huddle Cleanup Script for Windows
REM This script removes Huddle01 dependencies and cleans up installation files

echo ☕ Coffee Dates - Huddle Cleanup Script
echo ==========================================
echo.
echo This script will remove Huddle01 dependencies
echo.

cd client

echo Removing Huddle01 package...
call npm uninstall @huddle01/react

echo.
echo Cleaning up node_modules and lock files...
if exist "package-lock.json" del package-lock.json
if exist "pnpm-lock.yaml" del pnpm-lock.yaml
if exist "yarn.lock" del yarn.lock

echo.
echo Reinstalling dependencies...
call npm install

echo.
echo ==========================================
echo ✅ Cleanup Complete!
echo ==========================================
echo.
echo Huddle01 has been completely removed from your project.
echo.
echo Next steps:
echo   1. Use the new WebRTC video calling at /video-call
echo   2. Run: npm start
echo.
pause
