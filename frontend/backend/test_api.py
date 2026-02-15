import asyncio
import requests
import json
from server import app
from fastapi.testclient import TestClient

def test_api_endpoints():
    client = TestClient(app)
    
    print("Testing HackathonHub API endpoints...")
    
    # Test public leaderboard (no auth required)
    print("\n1. Testing public leaderboard...")
    response = client.get("/api/public/leaderboard")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test admin login
    print("\n2. Testing admin login...")
    login_data = {
        "role": "admin",
        "identifier": "admin", 
        "password": "admin123"
    }
    response = client.post("/api/auth/login", json=login_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        admin_token = response.json()["token"]
        print("Admin login successful!")
        
        # Test admin endpoints
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        print("\n3. Testing admin judges endpoint...")
        response = client.get("/api/admin/judges", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Judges: {response.json()}")
        
        print("\n4. Testing admin criteria endpoint...")
        response = client.get("/api/admin/criteria", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Criteria: {response.json()}")
        
        print("\n5. Testing admin leaderboard...")
        response = client.get("/api/admin/leaderboard", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Leaderboard: {response.json()}")
        
    else:
        print(f"Admin login failed: {response.json()}")
    
    print("\n✅ API testing completed!")

if __name__ == "__main__":
    test_api_endpoints()