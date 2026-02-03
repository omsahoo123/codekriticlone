# HackathonHub - Startup Guide

## 🎯 Choose Your Startup Method

### Method 1: One-Click Start (Recommended)

#### Windows (PowerShell)
```powershell
.\start.ps1
```

#### Windows (Command Prompt)
```cmd
start.bat
```

#### Mac/Linux
```bash
node start.js
```

**What it does:**
- ✅ Checks MongoDB connection
- ✅ Starts backend on port 8000
- ✅ Starts frontend on port 3000
- ✅ Displays credentials and URLs

---

### Method 2: Docker (Easiest - No Local Setup)

**Prerequisites:** Docker and Docker Compose installed

```bash
docker-compose up
```

**What it does:**
- ✅ Starts MongoDB container
- ✅ Starts backend container
- ✅ Starts frontend container
- ✅ All services connected automatically

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- MongoDB: localhost:27017

**Stop services:**
```bash
docker-compose down
```

---

### Method 3: Manual Start (Full Control)

#### Terminal 1: Start MongoDB
```bash
mongod
```

#### Terminal 2: Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

#### Terminal 3: Start Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🔐 Login Credentials

| Role  | Username | Password   |
|-------|----------|-----------|
| Admin | admin    | admin123  |

**Team Password:** Set via Admin Dashboard

---

## 📍 Access Points

| Service  | URL                    | Purpose              |
|----------|------------------------|----------------------|
| Frontend | http://localhost:3000  | Web application      |
| Backend  | http://localhost:8000  | API server           |
| API Docs | http://localhost:8000/docs | Swagger UI (FastAPI) |

---

## ✅ Verification Checklist

After starting, verify:

- [ ] MongoDB is running (check with `mongod` command)
- [ ] Backend is accessible at http://localhost:8000
- [ ] Frontend is accessible at http://localhost:3000
- [ ] Can login with admin/admin123
- [ ] Admin dashboard loads without errors

---

## 🚨 Troubleshooting

### Issue: "MongoDB is not running"

**Solution:**
```bash
# Windows
mongod

# Mac (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue: "Port 8000 already in use"

**Solution:** Change backend port
```bash
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

Then update frontend `.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Issue: "Port 3000 already in use"

**Solution:** Change frontend port
```bash
cd frontend
PORT=3001 npm start
```

### Issue: "npm install fails"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

### Issue: "Python dependencies not found"

**Solution:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

---

## 🎮 First Steps After Login

### As Admin:

1. **Create Judges**
   - Go to "Judges" tab
   - Click "Add Judge"
   - Enter Judge ID, Name, and Password
   - Click "Create Judge"

2. **Create Judging Criteria**
   - Go to "Criteria" tab
   - Click "Add Criteria"
   - Enter Criteria Name and Max Score
   - Click "Create Criteria"

3. **Set Team Password**
   - Go to "Judges" tab
   - Scroll to "Set Team Password"
   - Enter a password for teams to use
   - Click "Set Password"

4. **Start Timer**
   - Go to "Timer" tab
   - Select end time for hackathon
   - Click "Start Timer"

### As Judge:

1. **View Teams**
   - Go to "Teams" tab
   - See all participating teams

2. **Submit Scores**
   - Select a team
   - Enter scores for each criterion
   - Click "Submit Scores"

3. **View Leaderboard**
   - Go to "Leaderboard" tab
   - See real-time rankings

### As Team:

1. **Update Profile**
   - Go to "Profile" tab
   - Enter team details
   - Add team members
   - Add project information
   - Click "Save Profile"

2. **View Scores**
   - Go to "Scores" tab
   - See current scores from judges

3. **Track Timer**
   - See countdown timer on dashboard

---

## 📊 API Testing

### Test Backend with cURL

**Login as Admin:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "identifier": "admin",
    "password": "admin123"
  }'
```

**Get Judges:**
```bash
curl -X GET http://localhost:8000/api/admin/judges \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get Public Leaderboard:**
```bash
curl http://localhost:8000/api/public/leaderboard
```

---

## 🔄 Restart Services

### Restart All (One Command)

**Windows:**
```powershell
.\start.ps1
```

**Mac/Linux:**
```bash
node start.js
```

### Restart Individual Services

**Backend:**
```bash
# Stop: Ctrl+C in backend terminal
# Start:
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
# Stop: Ctrl+C in frontend terminal
# Start:
cd frontend
npm start
```

---

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Images
```bash
docker-compose up --build
```

### Remove All Data
```bash
docker-compose down -v
```

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

## 🎯 Common Tasks

### Change Admin Password
1. Stop backend
2. Edit `backend/server.py` - change default password in `startup_event()`
3. Restart backend

### Change Database
1. Update `MONGO_URL` in `backend/.env`
2. Restart backend

### Change API Port
1. Update backend startup command (change `--port 8000`)
2. Update `REACT_APP_BACKEND_URL` in `frontend/.env`
3. Restart both services

### Enable HTTPS
1. Obtain SSL certificate
2. Update backend to use HTTPS
3. Update frontend `REACT_APP_BACKEND_URL` to use `https://`

---

## 📞 Support

**Still having issues?**

1. Check MongoDB is running: `mongod`
2. Check ports are available: `netstat -an | grep 8000`
3. Check logs for errors
4. Verify environment variables
5. Try restarting all services

---

## 🎉 You're Ready!

Your HackathonHub platform is now running. Start managing your hackathon! 🚀
