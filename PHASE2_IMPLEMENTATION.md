# HackathonHub - Phase 2 Implementation Guide

## 🚀 Phase 2 Features Implementation

This guide provides step-by-step instructions for implementing Phase 2 features.

---

## Feature 1: Real-Time Score Updates with WebSockets

### Backend Implementation

#### Step 1: Install Dependencies
```bash
cd backend
pip install python-socketio python-engineio
```

#### Step 2: Update requirements.txt
```
python-socketio>=5.9.0
python-engineio>=4.7.0
```

#### Step 3: Create WebSocket Manager
Create `backend/websocket_manager.py`:

```python
from typing import Set
from fastapi import WebSocket
import json
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.judge_connections: dict = {}
        self.team_connections: dict = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, role: str):
        await websocket.accept()
        self.active_connections.add(websocket)
        
        if role == "judge":
            self.judge_connections[user_id] = websocket
        elif role == "team":
            self.team_connections[user_id] = websocket
    
    def disconnect(self, websocket: WebSocket, user_id: str, role: str):
        self.active_connections.discard(websocket)
        
        if role == "judge" and user_id in self.judge_connections:
            del self.judge_connections[user_id]
        elif role == "team" and user_id in self.team_connections:
            del self.team_connections[user_id]
    
    async def broadcast_score_update(self, data: dict):
        """Broadcast score update to all connected clients"""
        message = {
            "type": "score_update",
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending message: {e}")
    
    async def notify_team(self, team_name: str, data: dict):
        """Notify specific team"""
        message = {
            "type": "team_notification",
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        if team_name in self.team_connections:
            try:
                await self.team_connections[team_name].send_json(message)
            except Exception as e:
                print(f"Error sending team notification: {e}")
    
    async def notify_judge(self, judge_id: str, data: dict):
        """Notify specific judge"""
        message = {
            "type": "judge_notification",
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        if judge_id in self.judge_connections:
            try:
                await self.judge_connections[judge_id].send_json(message)
            except Exception as e:
                print(f"Error sending judge notification: {e}")

manager = ConnectionManager()
```

#### Step 4: Add WebSocket Endpoint to server.py
```python
from fastapi import WebSocket, WebSocketDisconnect
from websocket_manager import manager

@app.websocket("/ws/{user_id}/{role}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, role: str):
    await manager.connect(websocket, user_id, role)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id, role)
```

#### Step 5: Update Score Submission Endpoint
```python
@api_router.post("/judge/score")
async def submit_score(score_data: ScoreSubmit, payload: dict = Depends(verify_token)):
    if payload.get("role") != "judge":
        raise HTTPException(status_code=403, detail="Judge access required")
    
    judge_id = payload.get("identifier")
    
    # ... existing score submission code ...
    
    # Broadcast score update
    await manager.broadcast_score_update({
        "team_name": score_data.team_name,
        "judge_id": judge_id,
        "scores": score_data.scores,
        "timestamp": datetime.now().isoformat()
    })
    
    return {"message": "Score submitted successfully"}
```

### Frontend Implementation

#### Step 1: Create WebSocket Hook
Create `frontend/src/hooks/useWebSocket.js`:

```javascript
import { useEffect, useRef, useCallback } from 'react';

export function useWebSocket(userId, role, onMessage) {
  const ws = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/${userId}/${role}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        // Reconnect logic
      }, 3000);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId, role, onMessage]);

  return ws.current;
}
```

#### Step 2: Update Leaderboard Component
```javascript
import { useWebSocket } from '@/hooks/useWebSocket';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const { role, identifier } = getStoredAuth();

  const handleWebSocketMessage = useCallback((message) => {
    if (message.type === 'score_update') {
      // Refresh leaderboard
      loadLeaderboard();
      // Show notification
      toast.success('Leaderboard updated!');
    }
  }, []);

  useWebSocket(identifier, role, handleWebSocketMessage);

  // ... rest of component
}
```

---

## Feature 2: File Upload for Team Photos

### Backend Implementation

#### Step 1: Create Upload Directory
```bash
mkdir -p backend/uploads
```

#### Step 2: Add File Upload Endpoint
```python
from fastapi import File, UploadFile
import os
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@api_router.post("/team/upload-photo")
async def upload_photo(file: UploadFile = File(...), payload: dict = Depends(verify_token)):
    if payload.get("role") != "team":
        raise HTTPException(status_code=403, detail="Team access required")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Validate file size (5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Save file
    team_name = payload.get("identifier")
    filename = f"{team_name}_{file.filename}"
    filepath = UPLOAD_DIR / filename
    
    with open(filepath, "wb") as f:
        f.write(contents)
    
    # Update team profile with photo URL
    photo_url = f"/uploads/{filename}"
    await db.teams.update_one(
        {"team_name": team_name},
        {"$set": {"photo_url": photo_url}}
    )
    
    return {"photo_url": photo_url, "message": "Photo uploaded successfully"}
```

#### Step 3: Serve Static Files
```python
from fastapi.staticfiles import StaticFiles

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

### Frontend Implementation

#### Step 1: Create File Upload Component
Create `frontend/src/components/PhotoUpload.jsx`:

```javascript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { api } from '@/utils/api';

export function PhotoUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/team/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Photo uploaded successfully!');
      onUploadSuccess(response.data.photo_url);
      setFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {preview && (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
```

---

## Feature 3: Export Results

### Backend Implementation

#### Step 1: Install Dependencies
```bash
pip install pandas openpyxl reportlab
```

#### Step 2: Create Export Endpoints
```python
from io import BytesIO
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors

@api_router.get("/admin/export/csv")
async def export_csv(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get leaderboard data
    teams = await db.teams.find({}, {"_id": 0}).to_list(1000)
    leaderboard = []
    
    for team in teams:
        scores = await db.scores.find({"team_name": team["team_name"]}, {"_id": 0}).to_list(1000)
        if scores:
            total = sum(sum(s["scores"].values()) for s in scores)
            avg_score = total / len(scores)
            leaderboard.append({
                "team_name": team["team_name"],
                "total_score": round(avg_score, 2),
                "judge_count": len(scores)
            })
    
    leaderboard.sort(key=lambda x: x["total_score"], reverse=True)
    
    # Create DataFrame
    df = pd.DataFrame(leaderboard)
    df.insert(0, 'rank', range(1, len(df) + 1))
    
    # Return CSV
    output = BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leaderboard.csv"}
    )

@api_router.get("/admin/export/json")
async def export_json(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Get all data
    teams = await db.teams.find({}, {"_id": 0}).to_list(1000)
    judges = await db.judges.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    criteria = await db.criteria.find({}, {"_id": 0}).to_list(1000)
    
    export_data = {
        "timestamp": datetime.now().isoformat(),
        "teams": teams,
        "judges": judges,
        "criteria": criteria,
        "leaderboard": []
    }
    
    # Add leaderboard
    for team in teams:
        scores = await db.scores.find({"team_name": team["team_name"]}, {"_id": 0}).to_list(1000)
        if scores:
            total = sum(sum(s["scores"].values()) for s in scores)
            avg_score = total / len(scores)
            export_data["leaderboard"].append({
                "team_name": team["team_name"],
                "total_score": round(avg_score, 2),
                "judge_count": len(scores)
            })
    
    return export_data
```

### Frontend Implementation

#### Step 1: Add Export Buttons
```javascript
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { toast } from 'sonner';

export function ExportButtons() {
  const handleExport = async (format) => {
    try {
      const response = await api.get(`/admin/export/${format}`);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(response.data)]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leaderboard.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleExport('csv')} className="btn-primary">
        Export CSV
      </Button>
      <Button onClick={() => handleExport('json')} className="btn-primary">
        Export JSON
      </Button>
    </div>
  );
}
```

---

## Feature 4: Team Registration Form

### Backend Implementation

#### Step 1: Create Registration Endpoint
```python
class TeamRegistration(BaseModel):
    team_name: str
    leader_name: str
    leader_email: str
    members: List[str]
    project_name: str

@api_router.post("/register/team")
async def register_team(registration: TeamRegistration):
    # Check if team already exists
    existing = await db.teams.find_one({"team_name": registration.team_name})
    if existing:
        raise HTTPException(status_code=400, detail="Team name already exists")
    
    # Create team
    await db.teams.insert_one({
        "team_name": registration.team_name,
        "leader_name": registration.leader_name,
        "leader_email": registration.leader_email,
        "members": registration.members,
        "project_name": registration.project_name,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"message": "Team registered successfully"}
```

### Frontend Implementation

#### Step 1: Create Registration Page
Create `frontend/src/pages/TeamRegistration.js`:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { api } from '@/utils/api';
import { toast } from 'sonner';

export default function TeamRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    team_name: '',
    leader_name: '',
    leader_email: '',
    members: [''],
    project_name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/register/team', formData);
      toast.success('Team registered successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ocean-bg min-h-screen flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Team Registration</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Team Name</Label>
            <Input
              value={formData.team_name}
              onChange={(e) => setFormData({...formData, team_name: e.target.value})}
              className="input-ocean"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Leader Name</Label>
            <Input
              value={formData.leader_name}
              onChange={(e) => setFormData({...formData, leader_name: e.target.value})}
              className="input-ocean"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Leader Email</Label>
            <Input
              type="email"
              value={formData.leader_email}
              onChange={(e) => setFormData({...formData, leader_email: e.target.value})}
              className="input-ocean"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300">Project Name</Label>
            <Input
              value={formData.project_name}
              onChange={(e) => setFormData({...formData, project_name: e.target.value})}
              className="input-ocean"
              required
            />
          </div>

          <Button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register Team'}
          </Button>
        </form>

        <p className="text-center text-slate-400 mt-4">
          Already registered? <a href="/" className="text-cyan-400 hover:underline">Login</a>
        </p>
      </Card>
    </div>
  );
}
```

---

## Feature 5: Email Notifications

### Backend Implementation

#### Step 1: Install Dependencies
```bash
pip install python-dotenv aiosmtplib email-validator
```

#### Step 2: Create Email Service
Create `backend/email_service.py`:

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.sender_email = os.getenv('SENDER_EMAIL')
        self.sender_password = os.getenv('SENDER_PASSWORD')
    
    async def send_score_notification(self, team_email: str, team_name: str, scores: dict):
        subject = f"Score Update - {team_name}"
        body = f"""
        Hello {team_name},
        
        Your team has received new scores:
        {scores}
        
        Check the leaderboard for more details.
        
        Best regards,
        HackathonHub Team
        """
        
        await self._send_email(team_email, subject, body)
    
    async def send_judge_notification(self, judge_email: str, team_name: str):
        subject = f"New Team to Score - {team_name}"
        body = f"""
        Hello Judge,
        
        A new team has registered: {team_name}
        
        Please visit the dashboard to score this team.
        
        Best regards,
        HackathonHub Team
        """
        
        await self._send_email(judge_email, subject, body)
    
    async def _send_email(self, recipient: str, subject: str, body: str):
        try:
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = recipient
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email (implement async version)
            # For now, using synchronous version
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)
        except Exception as e:
            print(f"Error sending email: {e}")

email_service = EmailService()
```

#### Step 3: Update .env
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
```

---

## 🧪 Testing Phase 2 Features

### WebSocket Testing
```bash
# Test WebSocket connection
wscat -c ws://localhost:8000/ws/test-user/judge
```

### File Upload Testing
```bash
# Test file upload
curl -X POST http://localhost:8000/api/team/upload-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-image.jpg"
```

### Export Testing
```bash
# Test CSV export
curl http://localhost:8000/api/admin/export/csv \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o leaderboard.csv
```

---

## 📝 Implementation Checklist

- [ ] WebSocket setup complete
- [ ] File upload working
- [ ] Export functionality working
- [ ] Team registration form complete
- [ ] Email notifications configured
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Performance verified
- [ ] Security verified
- [ ] Ready for production

---

**Created:** February 3, 2026
**Version:** 1.0
**Status:** READY FOR IMPLEMENTATION
