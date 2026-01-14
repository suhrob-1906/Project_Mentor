import os
import django
import sys

# Setup django
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from mentor.models import Course, Module, Lesson

def check_stats():
    for course in Course.objects.all():
        print(f"\nCourse: {course.title_en} ({course.slug})")
        modules = Module.objects.filter(course=course)
        print(f"  Modules: {modules.count()}")
        
        theory = Lesson.objects.filter(module__course=course, lesson_type='theory')
        practice = Lesson.objects.filter(module__course=course, lesson_type='practice')
        
        print(f"  Theory Lessons: {theory.count()}")
        print(f"  Practice Lessons: {practice.count()}")
        
        # Check actual content depth
        steps_total = sum(len(l.theory_steps or []) for l in theory)
        tasks_total = sum(len(l.practice_tasks or []) for l in practice)
        
        print(f"  Total Theory Steps: {steps_total}")
        print(f"  Total Practice Tasks: {tasks_total}")

if __name__ == '__main__':
    check_stats()
