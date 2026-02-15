@echo off
REM Start CODEKRITI4.O - Backend and Frontend

echo.
echo 🚀 Starting CODEKRITI4.O Application...
echo.
echo 📦 Backend: http://localhost:8000
echo 🎨 Frontend: http://localhost:3000
echo.

REM Start Backend in new window
echo Starting Backend...
start "CODEKRITI4.O Backend" cmd /k "cd backend && python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend...
start "CODEKRITI4.O Frontend" cmd /k "npm start"

echo.
echo ✅ Both services started!
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo.
