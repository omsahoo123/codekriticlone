@echo off
REM HackathonHub - Start Both Frontend and Backend

echo.
echo 🚀 Starting HackathonHub Platform...
echo ==================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
python backend\test_mongo.py >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  MongoDB is not running. Please start MongoDB first.
    echo    Command: mongod
    echo.
    pause
    exit /b 1
)
echo ✓ MongoDB is running
echo.

REM Start Backend
echo Starting Backend Server...
start "HackathonHub Backend" cmd /k "cd backend && python -m uvicorn server:app --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend Server...
start "HackathonHub Frontend" cmd /k "cd frontend && npm start"

echo.
echo ==================================
echo ✓ Both servers are running!
echo ==================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Default Credentials:
echo   Admin: admin / admin123
echo.
echo Close the command windows to stop the servers.
echo.
pause
