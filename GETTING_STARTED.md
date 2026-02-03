# HackathonHub - Getting Started

## Prerequisites

Before running the application, ensure you have:

1. **Python 3.8+** - [Download](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download](https://nodejs.org/)
3. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)

## Quick Start (One Command)

### Option 1: Using Node.js Script (Recommended - Cross-Platform)

```bash
node start.js
```

This will:
- ✅ Check MongoDB connection
- ✅ Start backend on `http://localhost:8000`
- ✅ Start frontend on `http://localhost:3000`
- ✅ Open both in your browser

### Option 2: Using Batch Script (Windows Only)

```bash
start.bat
```

### Option 3: Using Shell Script (Mac/Linux)

```bash
chmod +x start.sh
./start.sh
```

---

## Manual Setup (If Preferred)

### Step 1: Start MongoDB

**Windows:**
```bash
mongod
```

**Mac (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 2: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Start Backend Server

```bash
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### Step 4: Install Frontend Dependencies (in a new terminal)

```bash
cd frontend
npm install
```

### Step 5: Start Frontend Server

```bash
cd frontend
npm start
```

Frontend will be available at: `http://localhost:3000`

---

## Default Credentials

| Role  | Username | Password   |
|-------|----------|-----------|
| Admin | admin    | admin123  |

**Team Password:** Set via Admin Dashboard

---

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Key Endpoints

#### Authentication
- `POST /auth/login` - Login for admin/judge/team

#### Admin Routes
- `GET /admin/judges` - List all judges
- `POST /admin/judges` - Create new judge
- `GET /admin/criteria` - List judging criteria
- `POST /admin/criteria` - Create new criteria
- `DELETE /admin/criteria/{id}` - Delete criteria
- `POST /admin/set-team-password` - Set team login password
- `POST /admin/timer` - Set/update hackathon timer
- `GET /admin/leaderboard` - Get leaderboard

#### Judge Routes
- `GET /judge/teams` - List all teams
- `GET /judge/criteria` - Get judging criteria
- `POST /judge/score` - Submit scores for a team
- `GET /judge/leaderboard` - View leaderboard

#### Team Routes
- `GET /team/profile` - Get team profile
- `PUT /team/profile` - Update team profile
- `GET /team/score` - Get team's current score
- `GET /team/timer` - Get hackathon timer

#### Public Routes
- `GET /public/leaderboard` - Public leaderboard (no auth required)

---

## Project Structure

```
hackathonhub/
├── backend/
│   ├── server.py           # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend configuration
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # UI components
│   │   └── utils/         # Utility functions
│   ├── package.json       # Node dependencies
│   └── .env              # Frontend configuration
├── start.js              # Cross-platform startup script
├── start.bat             # Windows startup script
└── start.sh              # Mac/Linux startup script
```

---

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB is not running
```
**Solution:** Start MongoDB service
```bash
mongod
```

### Port Already in Use
If port 8000 or 3000 is already in use:

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

### Python Module Not Found
```bash
# Reinstall Python dependencies
pip install -r requirements.txt --force-reinstall
```

---

## Features

✅ **Admin Dashboard**
- Manage judges and judging criteria
- Set team login password
- Control hackathon timer
- View real-time leaderboard

✅ **Judge Dashboard**
- View all teams
- Submit scores for teams
- View live leaderboard

✅ **Team Dashboard**
- Manage team profile
- View current scores
- Track hackathon timer

✅ **Public Leaderboard**
- Real-time score updates
- Accessible without authentication

✅ **Authentication**
- JWT-based authentication
- Role-based access control (Admin/Judge/Team)

✅ **Design**
- Marine theme with ocean colors
- Glassmorphism effects
- Responsive design
- Smooth animations

---

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
python -m uvicorn server:app --reload
```

### Run Tests
```bash
cd backend
python backend_test.py
```

---

## Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Environment Variables

**Backend (.env):**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET_KEY=your-secret-key-change-in-production
```

**Frontend (.env):**
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## Support

For issues or questions, check:
1. MongoDB is running
2. Ports 8000 and 3000 are available
3. All dependencies are installed
4. Environment variables are set correctly

---

## License

HackathonHub Platform - 2026
