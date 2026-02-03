# Quick Start Visual Guide

## 🚀 Fastest Way to Run (30 seconds)

### Step 1: Open Terminal
```
Windows: Press Win+R, type "cmd" or "powershell"
Mac: Press Cmd+Space, type "terminal"
Linux: Press Ctrl+Alt+T
```

### Step 2: Navigate to Project
```bash
cd path/to/hackathonhub
```

### Step 3: Run One Command
```bash
node start.js
```

### Step 4: Wait for Output
```
✓ MongoDB connected
✓ Backend starting on port 8000
✓ Frontend starting on port 3000

URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
```

### Step 5: Open Browser
```
http://localhost:3000
```

---

## 📊 Visual Startup Flow

```
┌─────────────────────────────────────────────────────────┐
│                    node start.js                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │   Check MongoDB Connection          │
        │   ✓ Connected to localhost:27017    │
        └─────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
    ┌──────────────────┐  ┌──────────────────┐
    │  Start Backend   │  │ Start Frontend   │
    │  Port: 8000      │  │ Port: 3000       │
    │  ✓ Running       │  │ ✓ Running        │
    └──────────────────┘  └──────────────────┘
                │                   │
                └─────────┬─────────┘
                          ▼
        ┌─────────────────────────────────────┐
        │   Both Services Ready!              │
        │   Frontend: http://localhost:3000   │
        │   Backend: http://localhost:8000    │
        └─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │   Open Browser & Login              │
        │   Admin: admin / admin123           │
        │   Team: any name / team123          │
        └─────────────────────────────────────┘
```

---

## 🎯 Login Credentials

### Admin Dashboard
```
Role: Admin
Username: admin
Password: admin123
```

### Judge Dashboard
```
Role: Judge
Judge ID: judge1
Password: judge123
```

### Team Dashboard
```
Role: Team
Team Name: (any name)
Password: team123
```

---

## 📱 What You'll See

### 1. Login Page
```
┌─────────────────────────────────────┐
│                                     │
│        🌊 HackathonHub 🌊          │
│                                     │
│   Select Role:                      │
│   ○ Admin  ○ Judge  ○ Team         │
│                                     │
│   Username/ID: [____________]       │
│   Password:    [____________]       │
│                                     │
│   [Login Button]                    │
│                                     │
└─────────────────────────────────────┘
```

### 2. Admin Dashboard
```
┌─────────────────────────────────────┐
│  Admin Dashboard                    │
├─────────────────────────────────────┤
│  Tabs:                              │
│  [Overview] [Judges] [Criteria]     │
│  [Timer] [Leaderboard]              │
│                                     │
│  Content Area:                      │
│  - Manage judges                    │
│  - Set scoring criteria             │
│  - Configure timer                  │
│  - View leaderboard                 │
│                                     │
└─────────────────────────────────────┘
```

### 3. Team Dashboard
```
┌─────────────────────────────────────┐
│  Team Dashboard                     │
├─────────────────────────────────────┤
│  Tabs:                              │
│  [Team Members] [Project] [Status]  │
│                                     │
│  Team Members Tab:                  │
│  ┌──────────────┐ ┌──────────────┐ │
│  │ [Photo]      │ │ [Photo]      │ │
│  │ Name         │ │ Name         │ │
│  │ Email        │ │ Email        │ │
│  │ [Edit] [ID]  │ │ [Edit] [ID]  │ │
│  └──────────────┘ └──────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 Troubleshooting Quick Fixes

### Issue: "Port 3000 already in use"
```bash
# Kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: "MongoDB connection failed"
```bash
# Start MongoDB
# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

### Issue: "npm: command not found"
```bash
# Install Node.js from https://nodejs.org/
# Then try again
node start.js
```

### Issue: "Module not found"
```bash
# Reinstall dependencies
cd frontend && npm install
cd backend && pip install -r requirements.txt
```

---

## 📋 Checklist Before Running

- [ ] Node.js installed? (`node --version`)
- [ ] Python installed? (`python --version`)
- [ ] MongoDB running? (`mongosh`)
- [ ] In project directory? (`ls start.js`)
- [ ] Dependencies installed? (`npm install` in frontend)
- [ ] Backend dependencies? (`pip install -r requirements.txt`)

---

## 🎮 After Starting - What to Do

### 1. Test Admin Dashboard
```
1. Go to http://localhost:3000
2. Select "Admin" role
3. Enter: admin / admin123
4. Click Login
5. You should see Admin Dashboard
```

### 2. Test Team Dashboard
```
1. Go to http://localhost:3000
2. Select "Team" role
3. Enter any team name
4. Enter password: team123
5. Click Login
6. You should see Team Dashboard with member cards
```

### 3. Test Judge Dashboard
```
1. Go to http://localhost:3000
2. Select "Judge" role
3. Enter: judge1
4. Enter password: judge123
5. Click Login
6. You should see Judge Dashboard
```

### 4. Test New Features
```
Team Dashboard:
- Click "+ Add Member"
- Fill in member details
- Upload member photo
- Click "Save Member"
- See member card with QR code
- Click "Download ID Card"
- Check file downloads

Real-time Updates:
- Open leaderboard in 2 browsers
- Submit score in one
- See update in other (WebSocket)
```

---

## 📊 Service Status

### Check if Services are Running

```bash
# Check Backend
curl http://localhost:8000/api/public/leaderboard

# Check Frontend
# Open http://localhost:3000 in browser

# Check MongoDB
mongosh mongodb://localhost:27017
```

---

## 🛑 Stopping the Application

### If using `node start.js`
```bash
# Press Ctrl+C in terminal
# Both services will stop
```

### If using separate terminals
```bash
# Terminal 1: Ctrl+C (stops backend)
# Terminal 2: Ctrl+C (stops frontend)
```

### If using Docker
```bash
docker-compose down
```

---

## 🔄 Restarting

```bash
# Stop (Ctrl+C)
# Then start again
node start.js
```

---

## 📞 Need Help?

### Check Logs
```bash
# Backend logs appear in terminal
# Frontend logs in browser console (F12)
```

### Common Issues
- See `RUN_APPLICATION.md` for detailed troubleshooting
- Check `GETTING_STARTED.md` for setup help
- Review `QUICK_REFERENCE.md` for commands

### API Documentation
```
http://localhost:8000/docs
```

---

## ✨ Summary

### Fastest Way
```bash
node start.js
```

### Then Access
```
Frontend: http://localhost:3000
Backend: http://localhost:8000
```

### Default Login
```
Admin: admin / admin123
Team: any name / team123
Judge: judge1 / judge123
```

### That's It! 🎉

---

**Created:** February 3, 2026
**Version:** 1.0
**Status:** READY TO USE

