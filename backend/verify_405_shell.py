
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
import sys

# Force UTF-8 for output
sys.stdout.reconfigure(encoding='utf-8')

print("🚀 Verifying 405 Fix via Shell...")
client = APIClient()
User = get_user_model()

try:
    # Cleanup / Create temp user
    try:
        User.objects.filter(username="test_405_fix").delete()
    except:
        pass
        
    user = User.objects.create(username="test_405_fix", track="backend")
    client.force_authenticate(user=user)
    
    # 1. Test POST to /api/lessons/complete/
    print("Testing POST /api/lessons/complete/...")
    
    response = client.post('/api/lessons/complete/', {"lesson_slug": "intro-python"}, format='json')
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 405:
        print("❌ FAILED: Still getting 405 Method Not Allowed!")
    elif response.status_code == 404:
        print("✅ SUCCESS: 405 Gone (got 404, expected for dummy slug)")
    elif response.status_code == 200:
        print("✅ SUCCESS: 200 OK")
    else:
        print(f"✅ SUCCESS: Got {response.status_code} (Not 405)")

    # Cleanup
    user.delete()
except Exception as e:
    print(f"❌ Error: {e}")
