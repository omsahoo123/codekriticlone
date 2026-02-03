# How to Run HackathonHub Application

## 🚀 Quick Start (Recommended)

### Method 1: One-Command Startup (Both Frontend & Backend)

```bash
node start.js
```

This starts both services simultaneously:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

**What it does:**
- Checks MongoDB connection
- Starts backend on port 8000
- Starts frontend on port 3000
- Displays URLs and credentials
- Keeps both running together

---

## 📋 Step-by-Step Setup

### Prerequisites
Make sure you have installed:
- Node.js (v16+)
- Python (v3.11+)
- MongoDB (running locally or remote)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### Step 2: Configure Environment

**Backend (.env):**
```bash
cd backend
# Edit .env file with your settings
MONGO_URL=mongodb://localhost:27017
DB_NAME=hackathon_hub
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env):**
```bash
cd frontend
# Create .env file if needed
REACT_APP_API_URL=http://localhost:8000
```

---

## 🎯 Running Methods

### Method 1: Node.js Script (RECOMMENDED)

**Start everything with one command:**
```bash
node start.js
```

**Features:**
- ✅ Starts both frontend and backend
- ✅ Checks MongoDB connection
- ✅ Displays URLs and credentials
- ✅ Keeps both running
- ✅ Cross-platform (Windows, Mac, Linux)

**Output:**
```
✓ MongoDB connected
✓ Backend starting on port 8000
✓ Frontend starting on port 3000

URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

Default Credentials:
- Admin: admin / admin123
- Team Password: team123
```

---

### Method 2: Windows Batch Script

**For Windows users:**
```bash
start.bat
```

**What it does:**
- Opens two terminal windows
- Starts backend in one window
- Starts frontend in other window
- Both run simultaneously

---

### Method 3: Windows PowerShell Script

**For Windows PowerShell:**
```powershell
.\start.ps1
```

**What it does:**
- Starts backend and frontend
- Displays status messages
- Keeps both running

---

### Method 4: Mac/Linux Shell Script

**For Mac/Linux:**
```bash
bash start.sh
```

**What it does:**
- Starts backend and frontend
- Displays status messages
- Keeps both running

---

### Method 5: Manual Startup (Separate Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Then access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

### Method 6: Docker Compose (Production)

**Start with Docker:**
```bash
docker-compose up
```

**What it does:**
- Starts MongoDB container
- Starts backend container
- Starts frontend container
- All services connected

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

### Method 7: NPM Scripts (Frontend Only)

**Start only frontend:**
```bash
cd frontend
npm start
```

**Build frontend:**
```bash
cd frontend
npm run build
```

**Run tests:**
```bash
cd frontend
npm test
```

---

### Method 8: Python Direct (Backend Only)

**Start only backend:**
```bash
cd backend
python server.py
```

Or with uvicorn:
```bash
cd backend
uvicorn server:app --reload --port 8000
```

---

## 🔧 Configuration

### Backend Configuration

**File:** `backend/.env`

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=hackathon_hub

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Server
HOST=0.0.0.0
PORT=8000
```

### Frontend Configuration

**File:** `frontend/.env`

```env
# API
REACT_APP_API_URL=http://localhost:8000

# App
REACT_APP_NAME=HackathonHub
```

---

## 📊 Startup Comparison

| Method | Command | Frontend | Backend | Ease | Platform |
|--------|---------|----------|---------|------|----------|
| Node.js | `node start.js` | ✅ | ✅ | ⭐⭐⭐⭐⭐ | All |
| Batch | `start.bat` | ✅ | ✅ | ⭐⭐⭐⭐ | Windows |
| PowerShell | `.\start.ps1` | ✅ | ✅ | ⭐⭐⭐⭐ | Windows |
| Shell | `bash start.sh` | ✅ | ✅ | ⭐⭐⭐⭐ | Mac/Linux |
| Manual | 2 terminals | ✅ | ✅ | ⭐⭐⭐ | All |
| Docker | `docker-compose up` | ✅ | ✅ | ⭐⭐⭐ | All |
| NPM | `npm start` | ✅ | ❌ | ⭐⭐⭐⭐ | All |
| Python | `python server.py` | ❌ | ✅ | ⭐⭐⭐⭐ | All |

---

## ✅ Verification

### Check Backend is Running

```bash
# Test API endpoint
curl http://localhost:8000/api/public/leaderboard

# View API documentation
# Open browser: http://localhost:8000/docs
```

### Check Frontend is Running

```bash
# Open browser
http://localhost:3000

# Should see login page
```

### Check MongoDB Connection

```bash
# Test connection
mongosh mongodb://localhost:27017

# Or use MongoDB Compass GUI
```

---

## 🔍 Troubleshooting

### Port Already in Use

**Problem:** Port 3000 or 8000 already in use

**Solution:**
```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000 (Mac/Linux)
lsof -ti:8000 | xargs kill -9

# Windows - use Task Manager or:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Failed

**Problem:** Cannot connect to MongoDB

**Solution:**
```bash
# Check MongoDB is running
mongosh

# Or start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB
```

### Dependencies Not Installed

**Problem:** Module not found errors

**Solution:**
```bash
# Reinstall frontend dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install

# Reinstall backend dependencies
cd backend
pip install --upgrade -r requirements.txt
```

### Frontend Not Loading

**Problem:** Blank page or errors

**Solution:**
```bash
# Clear browser cache
# Ctrl+Shift+Delete (Chrome/Firefox)
# Cmd+Shift+Delete (Mac)

# Or hard refresh
# Ctrl+Shift+R (Chrome/Firefox)
# Cmd+Shift+R (Mac)
```

---

## 📱 Access Points

### After Starting

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | API endpoints |
| API Docs | http://localhost:8000/docs | Swagger documentation |
| API ReDoc | http://localhost:8000/redoc | ReDoc documentation |
| MongoDB | localhost:27017 | Database |

---

## 🎯 Default Credentials

### Admin Login
- **Username:** admin
- **Password:** admin123

### Team Login
- **Team Name:** Any team name
- **Password:** team123

### Judge Login
- **Judge ID:** judge1
- **Password:** judge123

---

## 📝 Logs & Debugging

### View Backend Logs

```bash
# Backend logs appear in terminal
# Look for:
# - INFO: Application startup complete
# - ERROR: Connection failed
# - WARNING: Deprecated feature
```

### View Frontend Logs

```bash
# Open browser console
# Press F12 or Ctrl+Shift+I
# Check Console tab for errors
```

### Enable Debug Mode

**Backend:**
```bash
# Set environment variable
export DEBUG=1
node start.js
```

**Frontend:**
```bash
# Set environment variable
export REACT_APP_DEBUG=true
npm start
```

---

## 🚀 Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

### Run Backend in Production

```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:8000 server:app
```

### Using Docker

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 🔄 Restart & Stop

### Stop Application

**If using `node start.js`:**
```bash
# Press Ctrl+C in terminal
```

**If using separate terminals:**
```bash
# Terminal 1 (Backend): Ctrl+C
# Terminal 2 (Frontend): Ctrl+C
```

**If using Docker:**
```bash
docker-compose down
```

### Restart Application

```bash
# Stop first
# Then start again
node start.js
```

---

## 💡 Tips & Tricks

### Quick Development Setup

```bash
# One-time setup
npm install -g nodemon  # Auto-reload on changes

# Then use
nodemon start.js
```

### Monitor Ports

```bash
# Mac/Linux
lsof -i :3000
lsof -i :8000

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

### Clear All Data

```bash
# Delete MongoDB data
# Mac: rm -rf /usr/local/var/mongodb
# Linux: sudo rm -rf /var/lib/mongodb

# Or use MongoDB Compass to delete collections
```

### Test API Endpoints

```bash
# Using curl
curl -X GET http://localhost:8000/api/public/leaderboard

# Using Postman
# Import collection from API docs
# http://localhost:8000/docs
```

---

## 📚 Quick Reference

### Most Common Commands

```bash
# Start everything (RECOMMENDED)
node start.js

# Start frontend only
cd frontend && npm start

# Start backend only
cd backend && python server.py

# Install dependencies
cd frontend && npm install
cd backend && pip install -r requirements.txt

# View API docs
# Open: http://localhost:8000/docs

# Access application
# Open: http://localhost:3000
```

---

## ✨ Summary

**Easiest way to run:**
```bash
node start.js
```

This single command:
- ✅ Starts backend on port 8000
- ✅ Starts frontend on port 3000
- ✅ Checks MongoDB connection
- ✅ Displays URLs and credentials
- ✅ Keeps both running together

**Then access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

**Created:** February 3, 2026
**Version:** 1.0
**Status:** READY TO USE

