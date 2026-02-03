# HackathonHub - Quick Reference Card

## 🚀 Start Application

```bash
# Recommended - One command
node start.js

# Or Windows
start.bat

# Or PowerShell
.\start.ps1

# Or Docker
docker-compose up
```

---

## 🔐 Default Credentials

```
Admin Username: admin
Admin Password: admin123
```

---

## 📍 URLs

```
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/docs
```

---

## 📁 Project Structure

```
hackathonhub/
├── backend/          # FastAPI server
├── frontend/         # React app
├── start.js          # Startup script
├── docker-compose.yml
└── README.md
```

---

## 🔧 Manual Start (3 Terminals)

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000

# Terminal 3: Frontend
cd frontend
npm start
```

---

## 📦 Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

## 🐳 Docker Commands

```bash
# Start
docker-compose up

# Start in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build
```

---

## 🔄 Restart Services

```bash
# All services
node start.js

# Backend only
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000

# Frontend only
cd frontend
npm start
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB not running | Run `mongod` |
| Port 8000 in use | Change to `--port 8001` |
| Port 3000 in use | Set `PORT=3001 npm start` |
| npm install fails | Run `npm cache clean --force` |
| Python deps missing | Run `pip install -r requirements.txt` |

---

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET_KEY=your-secret-key
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 🎯 First Steps

1. Start application: `node start.js`
2. Login: admin / admin123
3. Create judges
4. Create criteria
5. Set team password
6. Start timer
7. Share with participants

---

## 📚 Documentation

- `README.md` - Overview
- `GETTING_STARTED.md` - Setup guide
- `STARTUP_GUIDE.md` - Startup options
- `SETUP_COMPLETE.md` - Setup summary

---

## 🔗 API Endpoints

```
POST   /api/auth/login
GET    /api/admin/judges
POST   /api/admin/judges
GET    /api/admin/criteria
POST   /api/admin/criteria
DELETE /api/admin/criteria/{id}
POST   /api/admin/set-team-password
POST   /api/admin/timer
GET    /api/admin/leaderboard
GET    /judge/teams
POST   /judge/score
GET    /team/profile
PUT    /team/profile
GET    /public/leaderboard
```

---

## 💻 System Requirements

- Python 3.8+
- Node.js 16+
- MongoDB
- 2GB RAM minimum
- 500MB disk space

---

## 🎓 Tech Stack

**Frontend:** React, Tailwind, Radix UI
**Backend:** FastAPI, Python
**Database:** MongoDB
**Auth:** JWT

---

## 📞 Common Commands

```bash
# Check MongoDB
python backend/test_mongo.py

# Build frontend
cd frontend && npm run build

# Run tests
cd backend && python backend_test.py

# Clear npm cache
npm cache clean --force

# Update dependencies
npm update
pip install --upgrade -r requirements.txt
```

---

## 🎉 Ready to Go!

```bash
node start.js
```

Then visit: **http://localhost:3000**

---

**Last Updated:** February 3, 2026
**Version:** 1.0
