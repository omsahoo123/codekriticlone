# 🚀 START HERE - HackathonHub Quick Start

## ⚡ 30-Second Setup

### Step 1: Ensure MongoDB is Running
```bash
mongod
```

### Step 2: Start Everything
```bash
node start.js
```

### Step 3: Open Browser
```
http://localhost:3000
```

### Step 4: Login
```
Username: admin
Password: admin123
```

**Done!** 🎉

---

## 📍 What You'll See

```
┌─────────────────────────────────────────┐
│     HackathonHub Admin Dashboard        │
│                                         │
│  Overview  Judges  Criteria  Timer      │
│                                         │
│  Total Teams: 0                         │
│  Total Judges: 0                        │
│  Criteria: 0                            │
│                                         │
│  [Add Judge] [Add Criteria] [Settings]  │
└─────────────────────────────────────────┘
```

---

## 🎯 First 5 Minutes

### 1. Create a Judge (1 min)
- Click "Judges" tab
- Click "Add Judge"
- Enter: ID, Name, Password
- Click "Create Judge"

### 2. Create Criteria (1 min)
- Click "Criteria" tab
- Click "Add Criteria"
- Enter: Name, Max Score
- Click "Create Criteria"

### 3. Set Team Password (1 min)
- Scroll to "Set Team Password"
- Enter password
- Click "Set Password"

### 4. Start Timer (1 min)
- Click "Timer" tab
- Select end time
- Click "Start Timer"

### 5. Share with Participants (1 min)
- Give judges their credentials
- Give teams: team name + password
- Share leaderboard URL

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| Your App | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Public Leaderboard | http://localhost:3000/leaderboard |

---

## 👥 User Roles

### Admin
- Manage judges
- Create criteria
- Set passwords
- Control timer
- View leaderboard

### Judge
- View teams
- Submit scores
- View leaderboard

### Team
- Update profile
- View scores
- See timer

### Public
- View leaderboard (no login)

---

## 🔐 Credentials

```
Admin:
  Username: admin
  Password: admin123

Judges:
  Create in admin dashboard

Teams:
  Team Name: (any name)
  Password: (set in admin dashboard)
```

---

## 🛠️ If Something Goes Wrong

### MongoDB Not Running
```bash
mongod
```

### Port Already in Use
```bash
# Change backend port
python -m uvicorn server:app --port 8001

# Update frontend .env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Dependencies Missing
```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend
cd frontend && npm install
```

### Still Stuck?
1. Stop all services (Ctrl+C)
2. Restart MongoDB: `mongod`
3. Start again: `node start.js`

---

## 📚 Need More Help?

- **Setup Guide:** [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Startup Options:** [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)
- **Quick Reference:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Full Details:** [README.md](./README.md)

---

## 🎮 Try It Out

### As Admin
1. Create 2 judges
2. Create 3 criteria
3. Set team password to "password123"
4. Start timer for 1 hour

### As Judge
1. Login with judge credentials
2. View teams
3. Submit scores

### As Team
1. Login with team name + password
2. Update profile
3. View scores

### As Public
1. Visit leaderboard
2. See live rankings

---

## 🚀 Alternative Startup Methods

### Docker (No Setup)
```bash
docker-compose up
```

### Windows Batch
```cmd
start.bat
```

### PowerShell
```powershell
.\start.ps1
```

### Mac/Linux
```bash
./start.sh
```

---

## 💡 Pro Tips

1. **Keep MongoDB running** - It's required
2. **Use the startup script** - It handles everything
3. **Check browser console** - For frontend errors
4. **Check terminal** - For backend errors
5. **Restart if stuck** - Usually fixes issues

---

## 🎯 Common Tasks

### Change Admin Password
Edit `backend/server.py` line with `admin123`

### Add More Judges
Use admin dashboard "Add Judge" button

### Change Team Password
Use admin dashboard "Set Team Password"

### View API Documentation
Visit http://localhost:8000/docs

### Export Leaderboard
Copy from leaderboard page

---

## 📊 Dashboard Overview

```
ADMIN DASHBOARD
├── Overview
│   ├── Total Teams
│   ├── Total Judges
│   ├── Criteria Count
│   └── Leaderboard
├── Judges
│   ├── List Judges
│   ├── Add Judge
│   └── Set Team Password
├── Criteria
│   ├── List Criteria
│   ├── Add Criteria
│   └── Delete Criteria
└── Timer
    ├── Start Timer
    ├── Stop Timer
    └── View Countdown

JUDGE DASHBOARD
├── Teams
│   └── View All Teams
├── Criteria
│   └── View Scoring Criteria
├── Score Submission
│   └── Submit Scores
└── Leaderboard
    └── View Rankings

TEAM DASHBOARD
├── Profile
│   ├── Team Name
│   ├── Members
│   └── Project Details
├── Scores
│   └── View Current Scores
└── Timer
    └── Countdown Display

PUBLIC
└── Leaderboard
    └── View Rankings (No Login)
```

---

## ✅ Checklist

Before starting your hackathon:

- [ ] MongoDB is running
- [ ] Backend is running (http://localhost:8000)
- [ ] Frontend is running (http://localhost:3000)
- [ ] Can login as admin
- [ ] Created at least 1 judge
- [ ] Created at least 1 criteria
- [ ] Set team password
- [ ] Started timer
- [ ] Shared credentials with participants
- [ ] Tested judge scoring
- [ ] Tested team login
- [ ] Verified leaderboard updates

---

## 🎉 You're Ready!

```bash
node start.js
```

Then visit: **http://localhost:3000**

**Enjoy your hackathon!** 🚀

---

**Questions?** Check the documentation or review the code.

**Need help?** All files are well-commented and documented.

**Ready to deploy?** See [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) for deployment options.

---

**Last Updated:** February 3, 2026
**Version:** 1.0
