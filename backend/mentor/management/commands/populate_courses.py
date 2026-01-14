from django.core.management.base import BaseCommand
from mentor.models import Course, Module, Lesson
# Import V2 data
from mentor.content_data_v2 import BACKEND_COURSE_V2, FRONTEND_COURSE_V2

class Command(BaseCommand):
    help = 'Populates the database with initial course content (V2)'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting course population V2...")

        courses_data = [BACKEND_COURSE_V2, FRONTEND_COURSE_V2]

        for course_data in courses_data:
            course, _ = Course.objects.get_or_create(
                slug=course_data['slug'],
                defaults={
                    'title_en': course_data['title_en'],
                    'title_ru': course_data['title_ru'],
                    'description_en': course_data['description_en'],
                    'description_ru': course_data['description_ru']
                }
            )
            # update details
            course.title_en = course_data['title_en']
            course.title_ru = course_data['title_ru']
            course.description_en = course_data['description_en']
            course.description_ru = course_data['description_ru']
            course.save()
            
            self.stdout.write(f"Processing course: {course.title_en}")

            # Modules
            for mod_data in course_data['modules']:
                module, _ = Module.objects.get_or_create(
                    course=course,
                    title_en=mod_data['title_en'],
                    defaults={
                        'title_ru': mod_data['title_ru'],
                        'order': mod_data['order'],
                        'description_en': mod_data.get('description_en', ''),
                        'description_ru': mod_data.get('description_ru', '')
                    }
                )
                module.title_ru = mod_data['title_ru']
                module.title_en = mod_data['title_en']
                module.order = mod_data['order']
                module.save()
                
                # Lessons
                for lesson_data in mod_data['lessons']:
                    slug = lesson_data['slug']
                    
                    # Deduplication Logic
                    existing_lessons = Lesson.objects.filter(slug=slug)
                    if existing_lessons.count() > 1:
                        self.stdout.write(self.style.WARNING(f"Found duplicates for {slug}, cleaning up..."))
                        keep = existing_lessons.filter(module=module).first()
                        if not keep: keep = existing_lessons.first()
                        for l in existing_lessons:
                            if l.id != keep.id: l.delete()
                        lesson_obj = keep
                    else:
                        lesson_obj = existing_lessons.first()

                    defaults = {
                        'title_en': lesson_data['title_en'],
                        'title_ru': lesson_data['title_ru'],
                        'order': lesson_data['order'],
                        'lesson_type': lesson_data.get('type', 'theory'),
                        'content_en': lesson_data.get('content_en', ''),
                        'content_ru': lesson_data.get('content_ru', ''),
                        'initial_code': lesson_data.get('initial_code', ''),
                        'expected_output': lesson_data.get('expected_output', ''),
                        'verification_type': lesson_data.get('verification_type', 'ai_check')
                    }

                    if lesson_obj:
                        lesson_obj.module = module
                        for k, v in defaults.items():
                            setattr(lesson_obj, k, v)
                        lesson_obj.save()
                    else:
                        Lesson.objects.create(module=module, slug=slug, **defaults)
        
        self.stdout.write(self.style.SUCCESS('Successfully populated V2 courses.'))
