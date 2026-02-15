# CODEKRITI4.O - Automatic Setup and Start

Write-Host ""
Write-Host "========================================================================"
Write-Host "  CODEKRITI4.O - Automatic Setup and Start"
Write-Host "========================================================================"
Write-Host ""

# Check if npm is installed
Write-Host "Checking npm..."
try {
    npm --version | Out-Null
} catch {
    Write-Host "ERROR: npm not found. Please install Node.js from https://nodejs.org/"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
Write-Host "Checking Python..."
try {
    python --version | Out-Null
} catch {
    Write-Host "ERROR: Python not found. Please install Python from https://www.python.org/"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================================================"
Write-Host "  Step 1: Installing Node dependencies..."
Write-Host "========================================================================"
Write-Host ""
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================================================"
Write-Host "  Step 2: Installing Python dependencies..."
Write-Host "========================================================================"
Write-Host ""
pip install -r backend/requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: pip install failed"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================================================"
Write-Host "  Step 3: Verifying setup..."
Write-Host "========================================================================"
Write-Host ""
node verify-setup.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Setup verification found issues"
    Write-Host "Continuing anyway..."
}

Write-Host ""
Write-Host "========================================================================"
Write-Host "  Step 4: Starting CODEKRITI4.O..."
Write-Host "========================================================================"
Write-Host ""
node start.js

Read-Host "Press Enter to exit"
