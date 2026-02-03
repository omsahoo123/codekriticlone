# HackathonHub Platform

A full-stack hackathon management system with real-time scoring, team management, and live leaderboards.

## 🚀 Quick Start

### One Command to Start Everything

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Windows (Command Prompt):**
```cmd
start.bat
```

**Mac/Linux:**
```bash
node start.js
```

This will automatically:
- ✅ Check MongoDB connection
- ✅ Start backend server (http://localhost:8000)
- ✅ Start frontend server (http://localhost:3000)
- ✅ Open the application in your browser

---

## 📋 Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)

---

## 🔐 Default Credentials

| Role  | Username | Password   |
|-------|----------|-----------|
| Admin | admin    | admin123  |

**Team Password:** Set via Admin Dashboard

---

## 📚 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Detailed setup and usage instructions
- **[Cleanup Summary](./CLEANUP_SUMMARY.md)** - Project cleanup history

---

## ✨ Features

### Admin Dashboard
- 👥 Manage judges and judging criteria
- 🔐 Set team login password
- ⏱️ Control hackathon timer
- 📊 View real-time leaderboard

### Judge Dashboard
- 👀 View all participating teams
- 📝 Submit scores for teams
- 📊 View live leaderboard

### Team Dashboard
- 👤 Manage team profile and members
- 📈 View current scores
- ⏱️ Track hackathon timer

### Public Leaderboard
- 🌐 Real-time score updates
- 🔓 Accessible without authentication
- 📱 Responsive design

### Technical Features
- 🔐 JWT-based authentication
- 👮 Role-based access control
- 🎨 Marine theme with glassmorphism
- 📱 Fully responsive design
- ⚡ Real-time updates

---

## 🏗️ Project Structure

```
hackathonhub/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                  # Backend configuration
│   └── test_mongo.py         # MongoDB connection test
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # UI components
│   │   ├── utils/            # Utility functions
│   │   └── hooks/            # React hooks
│   ├── package.json          # Node dependencies
│   └── .env                 # Frontend configuration
├── start.js                  # Cross-platform startup script
├── start.bat                 # Windows batch script
├── start.ps1                 # Windows PowerShell script
├── start.sh                  # Mac/Linux shell script
├── GETTING_STARTED.md        # Detailed setup guide
└── README.md                 # This file
```

---

## 🔧 Manual Setup (If Preferred)

### 1. Start MongoDB
```bash
mongod
```

### 2. Install & Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

### 3. Install & Start Frontend (in new terminal)
```bash
cd frontend
npm install
npm start
```

---

## 🌐 API Endpoints

### Base URL: `http://localhost:8000/api`

#### Authentication
- `POST /auth/login` - Login for admin/judge/team

#### Admin Routes
- `GET /admin/judges` - List all judges
- `POST /admin/judges` - Create new judge
- `GET /admin/criteria` - List judging criteria
- `POST /admin/criteria` - Create new criteria
- `DELETE /admin/criteria/{id}` - Delete criteria
- `POST /admin/set-team-password` - Set team password
- `POST /admin/timer` - Set/update timer
- `GET /admin/leaderboard` - Get leaderboard

#### Judge Routes
- `GET /judge/teams` - List all teams
- `GET /judge/criteria` - Get criteria
- `POST /judge/score` - Submit scores
- `GET /judge/leaderboard` - View leaderboard

#### Team Routes
- `GET /team/profile` - Get team profile
- `PUT /team/profile` - Update profile
- `GET /team/score` - Get team score
- `GET /team/timer` - Get timer

#### Public Routes
- `GET /public/leaderboard` - Public leaderboard

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB is not running
```
**Solution:** Start MongoDB service
```bash
mongod
```

### Port Already in Use
**Backend (change port):**
```bash
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

**Frontend (change port):**
```bash
PORT=3001 npm start
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## 🎨 Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Radix UI Components
- React Router
- Axios
- Sonner (Toast notifications)

### Backend
- FastAPI
- Python 3.8+
- MongoDB with Motor (async driver)
- JWT Authentication
- Bcrypt (password hashing)

### Database
- MongoDB

---

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET_KEY=your-secret-key-change-in-production
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## 🚀 Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

The `build` folder is ready for deployment to any static hosting service.

### Deploy Backend
Use any Python hosting service (Heroku, Railway, Render, etc.)

---

## 📞 Support

For issues or questions:
1. Ensure MongoDB is running
2. Check ports 8000 and 3000 are available
3. Verify all dependencies are installed
4. Check environment variables are set correctly

---

## 📄 License

HackathonHub Platform - 2026

---

## 🎯 Next Steps

1. **Start the application:** `node start.js`
2. **Login as admin:** username: `admin`, password: `admin123`
3. **Create judges and criteria** in the Admin Dashboard
4. **Set team password** for team login
5. **Start the timer** when hackathon begins
6. **Judges submit scores** from Judge Dashboard
7. **View leaderboard** in real-time

Enjoy your hackathon! 🎉
