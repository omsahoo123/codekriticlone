# How to Run HackathonHub - Complete Guide

## 🎯 TL;DR (Too Long; Didn't Read)

### Just Run This:
```bash
node start.js
```

Then open: **http://localhost:3000**

Done! ✅

---

## 📚 Full Documentation

### Quick Start Guides
1. **QUICK_START_VISUAL.md** - Visual step-by-step guide
2. **STARTUP_COMMANDS.md** - Copy & paste ready commands
3. **RUN_APPLICATION.md** - Detailed explanation of all methods

### Choose Your Method

#### 🏆 RECOMMENDED (All Platforms)
```bash
node start.js
```
- Starts both frontend and backend
- Checks MongoDB connection
- Shows URLs and credentials
- Easiest method

#### 🪟 Windows Batch
```bash
start.bat
```
- Opens 2 terminal windows
- Starts both services

#### 🪟 Windows PowerShell
```powershell
.\start.ps1
```
- PowerShell script
- Starts both services

#### 🍎 Mac/Linux Shell
```bash
bash start.sh
```
- Shell script
- Starts both services

#### 🐳 Docker (Production)
```bash
docker-compose up
```
- Starts MongoDB, Backend, Frontend
- All in containers

#### 📱 Manual (Separate Terminals)
**Terminal 1:**
```bash
cd backend
python -m uvicorn server:app --reload --port 8000
```

**Terminal 2:**
```bash
cd frontend
npm start
```

---

## 🔧 First Time Setup

### 1. Install Node.js
- Download from https://nodejs.org/
- Install latest LTS version

### 2. Install Python
- Download from https://www.python.org/
- Install Python 3.11+

### 3. Install MongoDB
- Download from https://www.mongodb.com/
- Or use MongoDB Atlas (cloud)

### 4. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### 5. Start Application
```bash
node start.js
```

---

## 📱 Access Application

### After Starting
```
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
```

### Login Credentials
```
Admin:  admin / admin123
Team:   any name / team123
Judge:  judge1 / judge123
```

---

## 🎮 What to Do After Starting

### 1. Test Admin Dashboard
- Go to http://localhost:3000
- Select "Admin"
- Login with: admin / admin123
- You should see Admin Dashboard

### 2. Test Team Dashboard
- Go to http://localhost:3000
- Select "Team"
- Enter any team name
- Login with: team123
- You should see Team Dashboard with member cards

### 3. Test New Features
- Add team members
- Upload member photos
- Generate QR codes
- Download ID cards
- Check real-time updates

---

## 🛑 Stop Application

### If using `node start.js`
```bash
Press Ctrl+C in terminal
```

### If using separate terminals
```bash
Press Ctrl+C in each terminal
```

### If using Docker
```bash
docker-compose down
```

---

## 🔄 Restart Application

```bash
# Stop (Ctrl+C)
# Then start again
node start.js
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Not Running
```bash
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Dependencies Missing
```bash
cd frontend && npm install
cd backend && pip install -r requirements.txt
```

### Still Having Issues?
- See **RUN_APPLICATION.md** for detailed troubleshooting
- Check browser console (F12)
- Check terminal logs

---

## 📊 Startup Methods Comparison

| Method | Command | Platforms | Ease |
|--------|---------|-----------|------|
| Node.js | `node start.js` | All | ⭐⭐⭐⭐⭐ |
| Batch | `start.bat` | Windows | ⭐⭐⭐⭐ |
| PowerShell | `.\start.ps1` | Windows | ⭐⭐⭐⭐ |
| Shell | `bash start.sh` | Mac/Linux | ⭐⭐⭐⭐ |
| Docker | `docker-compose up` | All | ⭐⭐⭐ |
| Manual | 2 terminals | All | ⭐⭐⭐ |

---

## 📋 Checklist

Before running, make sure:
- [ ] Node.js installed (`node --version`)
- [ ] Python installed (`python --version`)
- [ ] MongoDB running (`mongosh`)
- [ ] In project directory (`ls start.js`)
- [ ] Dependencies installed (`npm install` in frontend)

---

## 🎯 Quick Commands

```bash
# Start everything
node start.js

# Start frontend only
cd frontend && npm start

# Start backend only
cd backend && python server.py

# Install dependencies
cd frontend && npm install
cd backend && pip install -r requirements.txt

# Check if running
curl http://localhost:8000/api/public/leaderboard

# View API docs
# Open: http://localhost:8000/docs

# Access app
# Open: http://localhost:3000
```

---

## 📞 Need More Help?

### Documentation Files
- **QUICK_START_VISUAL.md** - Visual guide with diagrams
- **STARTUP_COMMANDS.md** - All commands copy & paste ready
- **RUN_APPLICATION.md** - Detailed explanation of all methods
- **GETTING_STARTED.md** - Initial setup guide
- **QUICK_REFERENCE.md** - Quick lookup for commands

### API Documentation
```
http://localhost:8000/docs
```

### Browser Console
```
Press F12 to open developer tools
Check Console tab for errors
```

---

## ✨ Summary

### Fastest Way to Run
```bash
node start.js
```

### Then Access
```
http://localhost:3000
```

### Login With
```
Admin: admin / admin123
Team: any name / team123
Judge: judge1 / judge123
```

### That's It! 🎉

---

## 🚀 Next Steps

After starting:
1. ✅ Login to dashboard
2. ✅ Test features
3. ✅ Add team members
4. ✅ Upload photos
5. ✅ Generate QR codes
6. ✅ Download ID cards
7. ✅ Check real-time updates

---

**Created:** February 3, 2026
**Version:** 1.0
**Status:** READY TO USE

