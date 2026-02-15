import requests
import json

def test_backend_running():
    """Test if backend is accessible via HTTP"""
    try:
        # Test if server is running on localhost:8000
        response = requests.get("http://localhost:8000/api/public/leaderboard", timeout=5)
        print(f"✅ Backend is running! Status: {response.status_code}")
        print(f"Public leaderboard response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running on localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {e}")
        return False

def test_admin_login():
    """Test admin login functionality"""
    try:
        login_data = {
            "role": "admin",
            "identifier": "admin", 
            "password": "admin123"
        }
        response = requests.post("http://localhost:8000/api/auth/login", 
                               json=login_data, timeout=5)
        
        if response.status_code == 200:
            token = response.json()["token"]
            print("✅ Admin login successful!")
            
            # Test authenticated endpoint
            headers = {"Authorization": f"Bearer {token}"}
            judges_response = requests.get("http://localhost:8000/api/admin/judges", 
                                         headers=headers, timeout=5)
            print(f"✅ Admin judges endpoint: {judges_response.status_code}")
            return True
        else:
            print(f"❌ Admin login failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing admin login: {e}")
        return False

if __name__ == "__main__":
    print("Testing HackathonHub Backend...")
    print("=" * 50)
    
    if test_backend_running():
        test_admin_login()
    else:
        print("\n💡 To start the backend server, run:")
        print("   python -m uvicorn server:app --host 0.0.0.0 --port 8000")