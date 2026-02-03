from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"

# Models
class AdminCreate(BaseModel):
    username: str
    password: str

class JudgeCreate(BaseModel):
    judge_id: str
    name: str
    password: str

class JudgeResponse(BaseModel):
    judge_id: str
    name: str

class CriteriaCreate(BaseModel):
    name: str
    max_score: int

class CriteriaResponse(BaseModel):
    id: str
    name: str
    max_score: int

class LoginRequest(BaseModel):
    role: str
    identifier: str
    password: str

class LoginResponse(BaseModel):
    token: str
    role: str
    identifier: str

class TeamPasswordSet(BaseModel):
    password: str

class TimerConfig(BaseModel):
    end_time: str
    is_active: bool

class TimerResponse(BaseModel):
    end_time: Optional[str]
    is_active: bool
    time_remaining: Optional[int]

class TeamProfile(BaseModel):
    team_name: str
    leader_name: Optional[str] = None
    members: Optional[List[str]] = None
    project_name: Optional[str] = None
    project_description: Optional[str] = None
    project_url: Optional[str] = None
    photo_url: Optional[str] = None

class ScoreSubmit(BaseModel):
    team_name: str
    scores: Dict[str, int]

class LeaderboardEntry(BaseModel):
    rank: int
    team_name: str
    total_score: float
    judge_count: int

# Helper Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Initialize Admin
@app.on_event("startup")
async def startup_event():
    admin_exists = await db.admins.find_one({"username": "admin"})
    if not admin_exists:
        hashed = hash_password("admin123")
        await db.admins.insert_one({"username": "admin", "password_hash": hashed})
        logging.info("Default admin created: username=admin, password=admin123")

# Auth Routes
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    if req.role == "admin":
        admin = await db.admins.find_one({"username": req.identifier})
        if not admin or not verify_password(req.password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_token({"role": "admin", "identifier": req.identifier})
        return {"token": token, "role": "admin", "identifier": req.identifier}
    
    elif req.role == "judge":
        judge = await db.judges.find_one({"judge_id": req.identifier})
        if not judge or not verify_password(req.password, judge["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_token({"role": "judge", "identifier": req.identifier})
        return {"token": token, "role": "judge", "identifier": req.identifier}
    
    elif req.role == "team":
        team_config = await db.team_config.find_one({})
        if not team_config:
            raise HTTPException(status_code=400, detail="Team password not set by admin")
        if not verify_password(req.password, team_config["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid team password")
        team = await db.teams.find_one({"team_name": req.identifier})
        if not team:
            await db.teams.insert_one({"team_name": req.identifier})
        token = create_token({"role": "team", "identifier": req.identifier})
        return {"token": token, "role": "team", "identifier": req.identifier}
    
    raise HTTPException(status_code=400, detail="Invalid role")

# Admin Routes
@api_router.post("/admin/judges", response_model=JudgeResponse)
async def create_judge(judge: JudgeCreate, payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    existing = await db.judges.find_one({"judge_id": judge.judge_id})
    if existing:
        raise HTTPException(status_code=400, detail="Judge ID already exists")
    
    hashed = hash_password(judge.password)
    await db.judges.insert_one({
        "judge_id": judge.judge_id,
        "name": judge.name,
        "password_hash": hashed
    })
    return {"judge_id": judge.judge_id, "name": judge.name}

@api_router.get("/admin/judges", response_model=List[JudgeResponse])
async def get_judges(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    judges = await db.judges.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return judges

@api_router.post("/admin/criteria", response_model=CriteriaResponse)
async def create_criteria(criteria: CriteriaCreate, payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    from uuid import uuid4
    criteria_id = str(uuid4())
    await db.criteria.insert_one({
        "id": criteria_id,
        "name": criteria.name,
        "max_score": criteria.max_score
    })
    return {"id": criteria_id, "name": criteria.name, "max_score": criteria.max_score}

@api_router.get("/admin/criteria", response_model=List[CriteriaResponse])
async def get_criteria(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    criteria = await db.criteria.find({}, {"_id": 0}).to_list(1000)
    return criteria

@api_router.delete("/admin/criteria/{criteria_id}")
async def delete_criteria(criteria_id: str, payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.criteria.delete_one({"id": criteria_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Criteria not found")
    return {"message": "Criteria deleted"}

@api_router.post("/admin/set-team-password")
async def set_team_password(data: TeamPasswordSet, payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    hashed = hash_password(data.password)
    await db.team_config.delete_many({})
    await db.team_config.insert_one({"password_hash": hashed})
    return {"message": "Team password set successfully"}

@api_router.post("/admin/timer", response_model=TimerResponse)
async def set_timer(timer: TimerConfig, payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    await db.timer_config.delete_many({})
    await db.timer_config.insert_one({
        "end_time": timer.end_time,
        "is_active": timer.is_active
    })
    
    end_dt = datetime.fromisoformat(timer.end_time.replace('Z', '+00:00'))
    now = datetime.now(timezone.utc)
    time_remaining = int((end_dt - now).total_seconds()) if timer.is_active else None
    
    return {
        "end_time": timer.end_time,
        "is_active": timer.is_active,
        "time_remaining": time_remaining
    }

@api_router.get("/admin/timer", response_model=TimerResponse)
async def get_timer_admin(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    timer = await db.timer_config.find_one({}, {"_id": 0})
    if not timer:
        return {"end_time": None, "is_active": False, "time_remaining": None}
    
    time_remaining = None
    if timer.get("is_active"):
        end_dt = datetime.fromisoformat(timer["end_time"].replace('Z', '+00:00'))
        now = datetime.now(timezone.utc)
        time_remaining = int((end_dt - now).total_seconds())
    
    return {
        "end_time": timer.get("end_time"),
        "is_active": timer.get("is_active", False),
        "time_remaining": time_remaining
    }

@api_router.get("/admin/leaderboard", response_model=List[LeaderboardEntry])
async def get_admin_leaderboard(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
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
        else:
            leaderboard.append({
                "team_name": team["team_name"],
                "total_score": 0,
                "judge_count": 0
            })
    
    leaderboard.sort(key=lambda x: x["total_score"], reverse=True)
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return leaderboard

@api_router.get("/admin/teams", response_model=List[TeamProfile])
async def get_all_teams(payload: dict = Depends(verify_token)):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    teams = await db.teams.find({}, {"_id": 0}).to_list(1000)
    return teams

# Judge Routes
@api_router.get("/judge/teams", response_model=List[TeamProfile])
async def get_teams_for_judge(payload: dict = Depends(verify_token)):
    if payload.get("role") != "judge":
        raise HTTPException(status_code=403, detail="Judge access required")
    
    teams = await db.teams.find({}, {"_id": 0}).to_list(1000)
    return teams

@api_router.get("/judge/criteria", response_model=List[CriteriaResponse])
async def get_criteria_for_judge(payload: dict = Depends(verify_token)):
    if payload.get("role") != "judge":
        raise HTTPException(status_code=403, detail="Judge access required")
    
    criteria = await db.criteria.find({}, {"_id": 0}).to_list(1000)
    return criteria

@api_router.post("/judge/score")
async def submit_score(score_data: ScoreSubmit, payload: dict = Depends(verify_token)):
    if payload.get("role") != "judge":
        raise HTTPException(status_code=403, detail="Judge access required")
    
    judge_id = payload.get("identifier")
    existing = await db.scores.find_one({"judge_id": judge_id, "team_name": score_data.team_name})
    
    if existing:
        await db.scores.update_one(
            {"judge_id": judge_id, "team_name": score_data.team_name},
            {"$set": {"scores": score_data.scores, "timestamp": datetime.now(timezone.utc).isoformat()}}
        )
    else:
        await db.scores.insert_one({
            "judge_id": judge_id,
            "team_name": score_data.team_name,
            "scores": score_data.scores,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
    
    return {"message": "Score submitted successfully"}

@api_router.get("/judge/leaderboard", response_model=List[LeaderboardEntry])
async def get_judge_leaderboard(payload: dict = Depends(verify_token)):
    if payload.get("role") != "judge":
        raise HTTPException(status_code=403, detail="Judge access required")
    
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
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return leaderboard

# Team Routes
@api_router.get("/team/profile", response_model=TeamProfile)
async def get_team_profile(payload: dict = Depends(verify_token)):
    if payload.get("role") != "team":
        raise HTTPException(status_code=403, detail="Team access required")
    
    team_name = payload.get("identifier")
    team = await db.teams.find_one({"team_name": team_name}, {"_id": 0})
    if not team:
        return {"team_name": team_name}
    return team

@api_router.put("/team/profile", response_model=TeamProfile)
async def update_team_profile(profile: TeamProfile, payload: dict = Depends(verify_token)):
    if payload.get("role") != "team":
        raise HTTPException(status_code=403, detail="Team access required")
    
    team_name = payload.get("identifier")
    if profile.team_name != team_name:
        raise HTTPException(status_code=400, detail="Cannot change team name")
    
    await db.teams.update_one(
        {"team_name": team_name},
        {"$set": profile.model_dump()},
        upsert=True
    )
    
    return profile

@api_router.get("/team/score")
async def get_team_score(payload: dict = Depends(verify_token)):
    if payload.get("role") != "team":
        raise HTTPException(status_code=403, detail="Team access required")
    
    team_name = payload.get("identifier")
    scores = await db.scores.find({"team_name": team_name}, {"_id": 0}).to_list(1000)
    
    if not scores:
        return {"total_score": 0, "judge_count": 0, "breakdown": []}
    
    total = sum(sum(s["scores"].values()) for s in scores)
    avg_score = total / len(scores)
    
    return {
        "total_score": round(avg_score, 2),
        "judge_count": len(scores),
        "breakdown": scores
    }

@api_router.get("/team/timer", response_model=TimerResponse)
async def get_team_timer(payload: dict = Depends(verify_token)):
    if payload.get("role") != "team":
        raise HTTPException(status_code=403, detail="Team access required")
    
    timer = await db.timer_config.find_one({}, {"_id": 0})
    if not timer:
        return {"end_time": None, "is_active": False, "time_remaining": None}
    
    time_remaining = None
    if timer.get("is_active"):
        end_dt = datetime.fromisoformat(timer["end_time"].replace('Z', '+00:00'))
        now = datetime.now(timezone.utc)
        time_remaining = int((end_dt - now).total_seconds())
    
    return {
        "end_time": timer.get("end_time"),
        "is_active": timer.get("is_active", False),
        "time_remaining": time_remaining
    }

@api_router.get("/public/leaderboard", response_model=List[LeaderboardEntry])
async def get_public_leaderboard():
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
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    
    return leaderboard

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()