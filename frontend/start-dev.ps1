Write-Host ""
Write-Host "🚀 Starting CODEKRITI4.O Application..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Backend: http://localhost:8000" -ForegroundColor Green
Write-Host "🎨 Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host ""
Write-Host "✅ Both services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
