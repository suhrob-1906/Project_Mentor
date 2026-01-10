import requests
import random
import string

BASE_URL = "http://127.0.0.1:8001"

def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def test_backend():
    username = f"user_{random_string()}"
    print(f"Testing with user: {username}")
    
    # 1. Register
    reg_data = {
        "username": username,
        "password": "ValidPassword123!",
        "email": f"{username}@example.com",
        "primary_language": "python",
        "goal": "job"
    }
    r = requests.post(f"{BASE_URL}/auth/register/", json=reg_data)
    print(f"Register: {r.status_code}")
    if r.status_code != 201:
        print(r.text)
        return

    # 2. Login
    login_data = {"username": username, "password": "ValidPassword123!"}
    r = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    print(f"Login: {r.status_code}")
    token = r.json().get('access')
    if not token:
        print("No token")
        return
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Analyze
    code_text = "def hello():\n    print('world')"
    r = requests.post(f"{BASE_URL}/api/analyze/", json={"code_text": code_text}, headers=headers)
    print(f"Analyze: {r.status_code}")
    data = r.json()
    print(f"Level: {data.get('level')}")
    print(f"Roadmap items: {len(data.get('roadmap', []))}")
    print(f"Projects: {len(data.get('projects', []))}")

if __name__ == "__main__":
    test_backend()
