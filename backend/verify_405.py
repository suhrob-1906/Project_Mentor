
import os
import django
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
import sys

# Force UTF-8 for output
sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def verify_fix():
    print("🚀 Verifying 405 Fix...")
    client = APIClient()
    User = get_user_model()
    
    # Create temp user
    user, _ = User.objects.get_or_create(username="test_405_fix", defaults={"track": "backend"})
    client.force_authenticate(user=user)
    
    # 1. Test POST to /api/lessons/complete/
    # Before fix, this would hit LessonViewSet detail route -> 405 Method Not Allowed
    # After fix, should function correctly (or at least 400/200, not 405)
    print("\n------------------------------")
    print("Testing POST /api/lessons/complete/...")
    
    # We send dummy data, we just want to ensure it reaches the correct view
    # and doesn't get rejected as "Method Not Allowed" (405)
    response = client.post('/api/lessons/complete/', {"lesson_slug": "intro-python"}, format='json')
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 405:
        print("❌ FAILED: Still getting 405 Method Not Allowed!")
    elif response.status_code == 404:
        # 404 is fine (lesson might not exist), as long as its not 405
        print("✅ SUCCESS: 405 Gone (got 404, expected for dummy slug)")
    elif response.status_code == 200:
        print("✅ SUCCESS: 200 OK")
    else:
        print(f"✅ SUCCESS: Got {response.status_code} (Not 405)")

    # Cleanup
    user.delete()

if __name__ == "__main__":
    verify_fix()
