# HackathonHub - Start Both Frontend and Backend (PowerShell)

Write-Host ""
Write-Host "🚀 Starting HackathonHub Platform..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Cyan
$mongoTest = python backend/test_mongo.py 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
    Write-Host "   Command: mongod" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ MongoDB is running" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
$backendProcess = Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000" -WorkingDirectory "backend" -PassThru -NoNewWindow
Write-Host "✓ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green
Write-Host ""

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "frontend" -PassThru -NoNewWindow
Write-Host "✓ Frontend started (PID: $($frontendProcess.Id))" -ForegroundColor Green
Write-Host ""

Write-Host "==================================" -ForegroundColor Green
Write-Host "✓ Both servers are running!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Credentials:" -ForegroundColor Yellow
Write-Host "  Admin: admin / admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Close the command windows to stop the servers." -ForegroundColor Cyan
Write-Host ""

# Wait for user input
Read-Host "Press Enter to continue..."

# Cleanup
Write-Host "Stopping servers..." -ForegroundColor Cyan
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
Write-Host "✓ Servers stopped" -ForegroundColor Green
