import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from mentor.models import Course, Module

for course in Course.objects.all():
    count = course.modules.count()
    print(f"Course: {course.slug}, Modules: {count}")

python_course = Course.objects.get(slug='backend')
frontend_course = Course.objects.get(slug='frontend')

assert python_course.modules.count() == 25
assert frontend_course.modules.count() == 22
print("All counts are correct!")
