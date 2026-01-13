from django.core.management.base import BaseCommand
from mentor.models import Course, Module, Lesson
from mentor.content_data import BACKEND_COURSE, FRONTEND_COURSE

class Command(BaseCommand):
    help = 'Populates the database with initial course content'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting course population...")

        courses_data = [BACKEND_COURSE, FRONTEND_COURSE]

        for course_data in courses_data:
            course, _ = Course.objects.get_or_create(
                slug=course_data['slug'],
                defaults={
                    'title': course_data['title'],
                    'description': course_data['description']
                }
            )
            # update details if exists
            course.title = course_data['title']
            course.description = course_data['description']
            course.save()
            
            self.stdout.write(f"Processing course: {course.title}")

            # Modules
            for mod_data in course_data['modules']:
                module, _ = Module.objects.get_or_create(
                    course=course,
                    title=mod_data['title'],
                    defaults={
                        'order': mod_data['order'],
                        'description': mod_data.get('description', '')
                    }
                )
                module.order = mod_data['order']
                module.save()
                
                # Lessons
                for lesson_data in mod_data['lessons']:
                    slug = lesson_data['slug']
                    
                    # Deduplication Logic
                    existing_lessons = Lesson.objects.filter(slug=slug)
                    if existing_lessons.count() > 1:
                        self.stdout.write(self.style.WARNING(f"Found duplicates for {slug}, cleaning up..."))
                        # Keep the one that matches current module if possible, else first
                        keep = existing_lessons.filter(module=module).first()
                        if not keep:
                            keep = existing_lessons.first()
                        
                        for l in existing_lessons:
                            if l.id != keep.id:
                                l.delete()
                        lesson_obj = keep
                    else:
                        lesson_obj = existing_lessons.first()

                    defaults = {
                        'title': lesson_data['title'],
                        'order': lesson_data['order'],
                        'theory_content': lesson_data['theory'],
                        'practice_task': lesson_data['practice'],
                        'initial_code': lesson_data.get('initial_code', ''),
                        'expected_output': lesson_data.get('expected_output', ''),
                        'verification_type': lesson_data.get('verification_type', 'ai_check')
                    }

                    if lesson_obj:
                        # Update existing
                        lesson_obj.module = module # Handle move
                        for k, v in defaults.items():
                            setattr(lesson_obj, k, v)
                        lesson_obj.save()
                    else:
                        # Create new
                        Lesson.objects.create(module=module, slug=slug, **defaults)
        
        self.stdout.write(self.style.SUCCESS('Successfully populated courses and verified slugs.'))
