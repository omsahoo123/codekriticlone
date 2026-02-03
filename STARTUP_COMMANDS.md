# Startup Commands - Copy & Paste Ready

## 🚀 RECOMMENDED: One Command Startup

### Windows, Mac, or Linux
```bash
node start.js
```

**That's it!** Both frontend and backend start together.

---

## 📋 All Startup Methods

### Method 1: Node.js (BEST)
```bash
node start.js
```
✅ Starts both services
✅ Cross-platform
✅ Easiest

---

### Method 2: Windows Batch File
```bash
start.bat
```
✅ Windows only
✅ Opens 2 windows
✅ Both services run

---

### Method 3: Windows PowerShell
```powershell
.\start.ps1
```
✅ Windows PowerShell
✅ Both services run

---

### Method 4: Mac/Linux Shell
```bash
bash start.sh
```
✅ Mac/Linux only
✅ Both services run

---

### Method 5: Manual - Two Terminals

**Terminal 1 (Backend):**
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

---

### Method 6: Docker Compose
```bash
docker-compose up
```
✅ Starts MongoDB, Backend, Frontend
✅ All in containers
✅ Production-ready

---

### Method 7: Frontend Only
```bash
cd frontend
npm start
```
✅ Frontend on port 3000
✅ Backend must be running separately

---

### Method 8: Backend Only
```bash
cd backend
python server.py
```
✅ Backend on port 8000
✅ Frontend must be running separately

---

## 🔧 Initial Setup (First Time Only)

### Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

---

## 📝 Configuration (Optional)

### Backend .env
```bash
cd backend
# Edit .env file
MONGO_URL=mongodb://localhost:27017
DB_NAME=hackathon_hub
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

### Frontend .env
```bash
cd frontend
# Create .env file (optional)
REACT_APP_API_URL=http://localhost:8000
```

---

## ✅ Verification Commands

### Check Backend
```bash
curl http://localhost:8000/api/public/leaderboard
```

### Check Frontend
```bash
# Open in browser
http://localhost:3000
```

### Check MongoDB
```bash
mongosh mongodb://localhost:27017
```

### Check Ports
```bash
# Mac/Linux
lsof -i :3000
lsof -i :8000

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

---

## 🛑 Stop Commands

### Stop Everything
```bash
# Press Ctrl+C in terminal
```

### Stop Specific Service
```bash
# Mac/Linux - Kill port 3000
lsof -ti:3000 | xargs kill -9

# Mac/Linux - Kill port 8000
lsof -ti:8000 | xargs kill -9

# Windows - Kill port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Windows - Kill port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Stop Docker
```bash
docker-compose down
```

---

## 🔄 Restart Commands

### Quick Restart
```bash
# Stop (Ctrl+C)
# Then run again
node start.js
```

### Full Restart (Clear Cache)
```bash
# Stop services
# Clear frontend cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear backend cache
cd backend
pip install --upgrade -r requirements.txt

# Start again
node start.js
```

---

## 🎯 Access URLs

### After Starting
```
Frontend:     http://localhost:3000
Backend:      http://localhost:8000
API Docs:     http://localhost:8000/docs
API ReDoc:    http://localhost:8000/redoc
MongoDB:      localhost:27017
```

---

## 🔐 Default Credentials

### Admin
```
Username: admin
Password: admin123
```

### Team
```
Team Name: (any name)
Password: team123
```

### Judge
```
Judge ID: judge1
Password: judge123
```

---

## 🐛 Troubleshooting Commands

### Port Already in Use
```bash
# Find what's using port 3000
# Mac/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Kill it
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
taskkill /PID <PID> /F
```

### MongoDB Not Running
```bash
# Start MongoDB
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Check if running
mongosh
```

### Dependencies Missing
```bash
# Reinstall frontend
cd frontend
npm install

# Reinstall backend
cd backend
pip install -r requirements.txt
```

### Clear Everything & Start Fresh
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
pip install --upgrade -r requirements.txt

# Start
node start.js
```

---

## 📊 Command Comparison

| Task | Command |
|------|---------|
| Start everything | `node start.js` |
| Start frontend | `cd frontend && npm start` |
| Start backend | `cd backend && python server.py` |
| Install deps | `npm install` (frontend), `pip install -r requirements.txt` (backend) |
| View API docs | Open `http://localhost:8000/docs` |
| Access app | Open `http://localhost:3000` |
| Stop services | `Ctrl+C` |
| Check backend | `curl http://localhost:8000/api/public/leaderboard` |
| Check ports | `lsof -i :3000` (Mac/Linux) or `netstat -ano` (Windows) |

---

## 🎮 Quick Test After Starting

### Test Admin
```bash
# 1. Open http://localhost:3000
# 2. Select Admin
# 3. Enter: admin / admin123
# 4. Click Login
# 5. Should see Admin Dashboard
```

### Test Team
```bash
# 1. Open http://localhost:3000
# 2. Select Team
# 3. Enter any team name
# 4. Enter: team123
# 5. Click Login
# 6. Should see Team Dashboard with member cards
```

### Test Judge
```bash
# 1. Open http://localhost:3000
# 2. Select Judge
# 3. Enter: judge1
# 4. Enter: judge123
# 5. Click Login
# 6. Should see Judge Dashboard
```

---

## 📱 Browser Access

### After Starting
```
Open any browser and go to:
http://localhost:3000
```

### If Page Doesn't Load
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or clear cache
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)
```

---

## 🔍 View Logs

### Backend Logs
```bash
# Logs appear in terminal where you ran the command
# Look for:
# - INFO: Application startup complete
# - ERROR: Connection failed
```

### Frontend Logs
```bash
# Open browser console
F12 or Ctrl+Shift+I
# Check Console tab
```

---

## 🚀 Production Commands

### Build Frontend
```bash
cd frontend
npm run build
```

### Run Backend Production
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:8000 server:app
```

### Docker Production
```bash
docker-compose -f docker-compose.yml up -d
```

---

## 💡 Pro Tips

### Auto-reload on Changes
```bash
# Install nodemon
npm install -g nodemon

# Use it
nodemon start.js
```

### Monitor Services
```bash
# Mac/Linux - Watch ports
watch 'lsof -i :3000; lsof -i :8000'

# Windows - Task Manager
# Ctrl+Shift+Esc
```

### Test API
```bash
# Get leaderboard
curl http://localhost:8000/api/public/leaderboard

# Get judges
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/admin/judges
```

---

## ✨ Summary

### Fastest Way
```bash
node start.js
```

### Then Open
```
http://localhost:3000
```

### Login With
```
Admin: admin / admin123
Team: any name / team123
Judge: judge1 / judge123
```

### That's All! 🎉

---

**Created:** February 3, 2026
**Version:** 1.0
**Status:** READY TO USE

