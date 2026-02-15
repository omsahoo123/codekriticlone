from typing import Set, Dict
from fastapi import WebSocket
from datetime import datetime


class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.judge_connections: Dict[str, WebSocket] = {}
        self.team_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, role: str):
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
        
        if role == "judge":
            self.judge_connections[user_id] = websocket
        elif role == "team":
            self.team_connections[user_id] = websocket
    
    def disconnect(self, websocket: WebSocket, user_id: str, role: str):
        """Remove a disconnected WebSocket"""
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
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending message: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.active_connections.discard(conn)
    
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
    
    async def broadcast_leaderboard_update(self, leaderboard: list):
        """Broadcast updated leaderboard to all clients"""
        message = {
            "type": "leaderboard_update",
            "data": leaderboard,
            "timestamp": datetime.now().isoformat()
        }
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending leaderboard update: {e}")
                disconnected.append(connection)
        
        for conn in disconnected:
            self.active_connections.discard(conn)


# Global connection manager instance
manager = ConnectionManager()
