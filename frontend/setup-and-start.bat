@echo off
REM CODEKRITI4.O - Automatic Setup and Start

echo.
echo ========================================================================
echo  CODEKRITI4.O - Automatic Setup and Start
echo ========================================================================
echo.

REM Check if npm is installed
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo.
echo ========================================================================
echo  Step 1: Installing Node dependencies...
echo ========================================================================
echo.
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo ========================================================================
echo  Step 2: Installing Python dependencies...
echo ========================================================================
echo.
call pip install -r backend/requirements.txt
if errorlevel 1 (
    echo ERROR: pip install failed
    pause
    exit /b 1
)

echo.
echo ========================================================================
echo  Step 3: Verifying setup...
echo ========================================================================
echo.
call node verify-setup.js
if errorlevel 1 (
    echo WARNING: Setup verification found issues
    echo Continuing anyway...
)

echo.
echo ========================================================================
echo  Step 4: Starting CODEKRITI4.O...
echo ========================================================================
echo.
call node start.js

pause
