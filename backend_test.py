#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timezone, timedelta

class HackathonAPITester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.admin_token = None
        self.judge_token = None
        self.team_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "status": "PASS" if success else "FAIL",
            "details": details
        }
        self.test_results.append(result)
        
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {name}: {details}")

    def make_request(self, method, endpoint, data=None, token=None, expected_status=200):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            return success, response.json() if success else {}, response.status_code

        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}, 0

    def test_admin_login(self):
        """Test admin login with default credentials"""
        print("\n🔐 Testing Admin Authentication...")
        
        success, response, status_code = self.make_request(
            'POST', 'auth/login',
            data={"role": "admin", "identifier": "admin", "password": "admin123"}
        )
        
        if success and 'token' in response:
            self.admin_token = response['token']
            self.log_test("Admin Login", True, f"Token received, role: {response.get('role')}")
            return True
        else:
            self.log_test("Admin Login", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_admin_judge_management(self):
        """Test admin judge creation and retrieval"""
        print("\n👨‍⚖️ Testing Judge Management...")
        
        if not self.admin_token:
            self.log_test("Judge Management", False, "No admin token available")
            return False

        # Create a judge
        judge_data = {
            "judge_id": "judge001",
            "name": "Test Judge",
            "password": "judge123"
        }
        
        success, response, status_code = self.make_request(
            'POST', 'admin/judges', 
            data=judge_data, 
            token=self.admin_token,
            expected_status=200
        )
        
        if success:
            self.log_test("Create Judge", True, f"Judge created: {response.get('name')}")
        else:
            self.log_test("Create Judge", False, f"Status: {status_code}")

        # Get judges list
        success, response, status_code = self.make_request(
            'GET', 'admin/judges',
            token=self.admin_token
        )
        
        if success and isinstance(response, list):
            self.log_test("Get Judges", True, f"Found {len(response)} judges")
            return True
        else:
            self.log_test("Get Judges", False, f"Status: {status_code}")
            return False

    def test_admin_criteria_management(self):
        """Test admin criteria creation and management"""
        print("\n📋 Testing Criteria Management...")
        
        if not self.admin_token:
            self.log_test("Criteria Management", False, "No admin token available")
            return False

        # Create criteria
        criteria_data = {
            "name": "Innovation",
            "max_score": 10
        }
        
        success, response, status_code = self.make_request(
            'POST', 'admin/criteria',
            data=criteria_data,
            token=self.admin_token
        )
        
        criteria_id = None
        if success and 'id' in response:
            criteria_id = response['id']
            self.log_test("Create Criteria", True, f"Criteria created: {response.get('name')}")
        else:
            self.log_test("Create Criteria", False, f"Status: {status_code}")

        # Get criteria list
        success, response, status_code = self.make_request(
            'GET', 'admin/criteria',
            token=self.admin_token
        )
        
        if success and isinstance(response, list):
            self.log_test("Get Criteria", True, f"Found {len(response)} criteria")
        else:
            self.log_test("Get Criteria", False, f"Status: {status_code}")

        return criteria_id is not None

    def test_admin_team_password(self):
        """Test setting team password"""
        print("\n🔑 Testing Team Password Management...")
        
        if not self.admin_token:
            self.log_test("Team Password", False, "No admin token available")
            return False

        success, response, status_code = self.make_request(
            'POST', 'admin/set-team-password',
            data={"password": "team123"},
            token=self.admin_token
        )
        
        if success:
            self.log_test("Set Team Password", True, "Team password set successfully")
            return True
        else:
            self.log_test("Set Team Password", False, f"Status: {status_code}")
            return False

    def test_admin_timer_management(self):
        """Test timer start/stop functionality"""
        print("\n⏰ Testing Timer Management...")
        
        if not self.admin_token:
            self.log_test("Timer Management", False, "No admin token available")
            return False

        # Set timer
        end_time = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
        timer_data = {
            "end_time": end_time,
            "is_active": True
        }
        
        success, response, status_code = self.make_request(
            'POST', 'admin/timer',
            data=timer_data,
            token=self.admin_token
        )
        
        if success:
            self.log_test("Start Timer", True, f"Timer active: {response.get('is_active')}")
        else:
            self.log_test("Start Timer", False, f"Status: {status_code}")

        # Get timer status
        success, response, status_code = self.make_request(
            'GET', 'admin/timer',
            token=self.admin_token
        )
        
        if success:
            self.log_test("Get Timer Status", True, f"Active: {response.get('is_active')}")
            return True
        else:
            self.log_test("Get Timer Status", False, f"Status: {status_code}")
            return False

    def test_judge_login(self):
        """Test judge login"""
        print("\n👨‍⚖️ Testing Judge Authentication...")
        
        success, response, status_code = self.make_request(
            'POST', 'auth/login',
            data={"role": "judge", "identifier": "judge001", "password": "judge123"}
        )
        
        if success and 'token' in response:
            self.judge_token = response['token']
            self.log_test("Judge Login", True, f"Token received, role: {response.get('role')}")
            return True
        else:
            self.log_test("Judge Login", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_judge_functionality(self):
        """Test judge viewing teams and criteria"""
        print("\n📊 Testing Judge Functionality...")
        
        if not self.judge_token:
            self.log_test("Judge Functionality", False, "No judge token available")
            return False

        # Get teams for judge
        success, response, status_code = self.make_request(
            'GET', 'judge/teams',
            token=self.judge_token
        )
        
        if success:
            self.log_test("Judge Get Teams", True, f"Found {len(response)} teams")
        else:
            self.log_test("Judge Get Teams", False, f"Status: {status_code}")

        # Get criteria for judge
        success, response, status_code = self.make_request(
            'GET', 'judge/criteria',
            token=self.judge_token
        )
        
        if success:
            self.log_test("Judge Get Criteria", True, f"Found {len(response)} criteria")
            return True
        else:
            self.log_test("Judge Get Criteria", False, f"Status: {status_code}")
            return False

    def test_team_login(self):
        """Test team login and creation"""
        print("\n👥 Testing Team Authentication...")
        
        success, response, status_code = self.make_request(
            'POST', 'auth/login',
            data={"role": "team", "identifier": "TestTeam", "password": "team123"}
        )
        
        if success and 'token' in response:
            self.team_token = response['token']
            self.log_test("Team Login", True, f"Token received, role: {response.get('role')}")
            return True
        else:
            self.log_test("Team Login", False, f"Status: {status_code}, Response: {response}")
            return False

    def test_team_functionality(self):
        """Test team profile management"""
        print("\n📝 Testing Team Functionality...")
        
        if not self.team_token:
            self.log_test("Team Functionality", False, "No team token available")
            return False

        # Get team profile
        success, response, status_code = self.make_request(
            'GET', 'team/profile',
            token=self.team_token
        )
        
        if success:
            self.log_test("Get Team Profile", True, f"Team: {response.get('team_name')}")
        else:
            self.log_test("Get Team Profile", False, f"Status: {status_code}")

        # Update team profile
        profile_data = {
            "team_name": "TestTeam",
            "leader_name": "Test Leader",
            "members": ["Member 1", "Member 2"],
            "project_name": "Test Project",
            "project_description": "A test project for the hackathon",
            "project_url": "https://github.com/test/project",
            "photo_url": "https://via.placeholder.com/300x200"
        }
        
        success, response, status_code = self.make_request(
            'PUT', 'team/profile',
            data=profile_data,
            token=self.team_token
        )
        
        if success:
            self.log_test("Update Team Profile", True, "Profile updated successfully")
        else:
            self.log_test("Update Team Profile", False, f"Status: {status_code}")

        # Get team timer
        success, response, status_code = self.make_request(
            'GET', 'team/timer',
            token=self.team_token
        )
        
        if success:
            self.log_test("Get Team Timer", True, f"Timer active: {response.get('is_active')}")
        else:
            self.log_test("Get Team Timer", False, f"Status: {status_code}")

        # Get team score
        success, response, status_code = self.make_request(
            'GET', 'team/score',
            token=self.team_token
        )
        
        if success:
            self.log_test("Get Team Score", True, f"Score: {response.get('total_score', 0)}")
            return True
        else:
            self.log_test("Get Team Score", False, f"Status: {status_code}")
            return False

    def test_judge_scoring(self):
        """Test judge scoring functionality"""
        print("\n⭐ Testing Judge Scoring...")
        
        if not self.judge_token:
            self.log_test("Judge Scoring", False, "No judge token available")
            return False

        # Submit score for team
        score_data = {
            "team_name": "TestTeam",
            "scores": {"Innovation": 8}
        }
        
        success, response, status_code = self.make_request(
            'POST', 'judge/score',
            data=score_data,
            token=self.judge_token
        )
        
        if success:
            self.log_test("Submit Score", True, "Score submitted successfully")
            return True
        else:
            self.log_test("Submit Score", False, f"Status: {status_code}")
            return False

    def test_public_leaderboard(self):
        """Test public leaderboard access"""
        print("\n🏆 Testing Public Leaderboard...")
        
        success, response, status_code = self.make_request(
            'GET', 'public/leaderboard'
        )
        
        if success and isinstance(response, list):
            self.log_test("Public Leaderboard", True, f"Found {len(response)} teams")
            return True
        else:
            self.log_test("Public Leaderboard", False, f"Status: {status_code}")
            return False

    def test_admin_leaderboard(self):
        """Test admin leaderboard access"""
        print("\n📊 Testing Admin Leaderboard...")
        
        if not self.admin_token:
            self.log_test("Admin Leaderboard", False, "No admin token available")
            return False

        success, response, status_code = self.make_request(
            'GET', 'admin/leaderboard',
            token=self.admin_token
        )
        
        if success and isinstance(response, list):
            self.log_test("Admin Leaderboard", True, f"Found {len(response)} teams")
            return True
        else:
            self.log_test("Admin Leaderboard", False, f"Status: {status_code}")
            return False

    def run_all_tests(self):
        """Run comprehensive API tests"""
        print("🚀 Starting Hackathon API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        
        # Test admin functionality
        if self.test_admin_login():
            self.test_admin_judge_management()
            self.test_admin_criteria_management()
            self.test_admin_team_password()
            self.test_admin_timer_management()
            self.test_admin_leaderboard()

        # Test judge functionality
        if self.test_judge_login():
            self.test_judge_functionality()
            self.test_judge_scoring()

        # Test team functionality
        if self.test_team_login():
            self.test_team_functionality()

        # Test public endpoints
        self.test_public_leaderboard()

        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = HackathonAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_tests": tester.tests_run,
            "passed_tests": tester.tests_passed,
            "success_rate": (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0,
            "results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())