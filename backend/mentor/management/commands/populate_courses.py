from django.core.management.base import BaseCommand
from mentor.models import Course, Module, Lesson
from mentor.content_data import BACKEND_COURSE, FRONTEND_COURSE

class Command(BaseCommand):
    help = 'Populates the database with initial course content'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting course population...")

        courses_data = [BACKEND_COURSE, FRONTEND_COURSE]

        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                slug=course_data['slug'],
                defaults={
                    'title': course_data['title'],
                    'description': course_data['description']
                }
            )
            if created:
                self.stdout.write(f"Created course: {course.title}")
            else:
                self.stdout.write(f"Updated course: {course.title}")

            # Modules
            for mod_data in course_data['modules']:
                module, created = Module.objects.get_or_create(
                    course=course,
                    title=mod_data['title'],
                    defaults={
                        'order': mod_data['order'],
                        'description': mod_data.get('description', '')
                    }
                )
                
                # Lessons
                for lesson_data in mod_data['lessons']:
                    Lesson.objects.update_or_create(
                        module=module,
                        slug=lesson_data['slug'],
                        defaults={
                            'title': lesson_data['title'],
                            'order': lesson_data['order'],
                            'theory_content': lesson_data['theory'],
                            'practice_task': lesson_data['practice'],
                            'initial_code': lesson_data.get('initial_code', ''),
                            'expected_output': lesson_data.get('expected_output', ''),
                            'verification_type': lesson_data.get('verification_type', 'ai_check')
                        }
                    )
        
        self.stdout.write(self.style.SUCCESS('Successfully populated open courses courses'))
