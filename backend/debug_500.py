import os
import django
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from mentor.models import Lesson
from mentor.serializers import LessonDetailSerializer
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request

def run_debug():
    print("Debugging Lesson Retrieval...")
    User = get_user_model()
    try:
        user = User.objects.first()
        if not user:
            print("Creating temporary user...")
            user = User.objects.create_user(username='debug_user', password='password')
        
        print(f"Using user: {user.username}")

        try:
            lesson = Lesson.objects.get(slug='intro-setup')
            print(f"Found lesson: {lesson.title}")
        except Lesson.DoesNotExist:
            print("ERROR: Lesson 'intro-setup' not found in DB. Did populate_courses run?")
            return

        factory = APIRequestFactory()
        wsgi_request = factory.get('/api/lessons/intro-setup/')
        request = Request(wsgi_request)
        request.user = user

        print("Attempting serialization...")
        # Note: ViewSet passes 'request' in context, and 'user' manually in get_serializer_context
        serializer = LessonDetailSerializer(lesson, context={'request': request, 'user': user})
        data = serializer.data
        print("Serialization Successful!")
        print(data)

    except Exception as e:
        print(f"CRASHED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_debug()
