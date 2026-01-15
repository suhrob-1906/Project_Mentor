from rest_framework import serializers
from .models import Submission, AnalysisResult, Roadmap, ProjectRecommendation, TestQuestion, TestResult, Course, Module, Lesson, UserLessonProgress

class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    result = AnalysisResultSerializer(read_only=True)
    
    class Meta:
        model = Submission
        fields = ('id', 'github_url', 'code_text', 'code_file', 'created_at', 'result')
        read_only_fields = ('user',)

class RoadmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roadmap
        fields = '__all__'

class ProjectRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectRecommendation
        fields = '__all__'

class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestion
        fields = ('id', 'language', 'category', 'text_en', 'text_ru', 'options_en', 'options_ru', 'difficulty')

class TestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestResult
        fields = '__all__'

# --- COURSE SERIALIZERS ---

# --- COURSE SERIALIZERS ---

class LessonSimpleSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    is_unlocked = serializers.SerializerMethodField()
    # Compat fields
    title = serializers.CharField(source='title_en', read_only=True)

    class Meta:
        model = Lesson
        fields = ('id', 'slug', 'title', 'title_en', 'title_ru', 'order', 'lesson_type', 'is_completed', 'is_unlocked')

    def get_is_completed(self, obj):
        try:
            user = self.context.get('user')
            if user and user.is_authenticated:
                progress = UserLessonProgress.objects.filter(user=user, lesson=obj).first()
                return progress.is_completed if progress else False
        except Exception as e:
            print(f"Error in get_is_completed: {e}")
        return False

    def get_is_unlocked(self, obj):
        try:
            user = self.context.get('user')
            if not user or not user.is_authenticated:
                return obj.order == 1
            
            progress = UserLessonProgress.objects.filter(user=user, lesson=obj).first()
            if progress and progress.is_unlocked:
                return True
                
            if obj.order == 1:
                # First lesson in module - check if previous module is done
                if obj.module.order == 1:
                    return True  # First module, first lesson - always unlocked
                    
                prev_mod = Module.objects.filter(course=obj.module.course, order=obj.module.order - 1).first()
                if not prev_mod:
                    return True # First module of course
                
                last_lesson = prev_mod.lessons.order_by('-order').first()
                if not last_lesson:
                    return True
                    
                last_prog = UserLessonProgress.objects.filter(user=user, lesson=last_lesson).first()
                return last_prog.is_completed if last_prog else False
            
            # Unlock logic: Prev lesson in module must be completed
            prev_lesson = Lesson.objects.filter(module=obj.module, order=obj.order - 1).first()
            if prev_lesson:
                 prev_prog = UserLessonProgress.objects.filter(user=user, lesson=prev_lesson).first()
                 return prev_prog.is_completed if prev_prog else False
        except Exception as e:
            print(f"Error in get_is_unlocked: {e}")
                 
        return False

class LessonDetailSerializer(LessonSimpleSerializer):
    # Compat: map content_en to theory_content/practice_task depending on type
    theory_content = serializers.SerializerMethodField()
    practice_task = serializers.SerializerMethodField()
    theory_ref_en = serializers.SerializerMethodField()
    theory_ref_ru = serializers.SerializerMethodField()
    
    class Meta(LessonSimpleSerializer.Meta):
        fields = LessonSimpleSerializer.Meta.fields + (
            'content_en', 'content_ru', 
            'initial_code', 'expected_output', 'solution_code',
            'theory_steps', 'practice_tasks',
            'theory_content', 'practice_task', # Compat
            'theory_ref_en', 'theory_ref_ru'
        )

    def get_theory_content(self, obj):
        return obj.content_en if obj.lesson_type == 'theory' else ''

    def get_practice_task(self, obj):
        return obj.content_en if obj.lesson_type == 'practice' else ''

    def get_theory_ref_en(self, obj):
        if obj.lesson_type == 'practice':
            prev = Lesson.objects.filter(module=obj.module, order=obj.order - 1, lesson_type='theory').first()
            return prev.content_en if prev else ""
        return ""

    def get_theory_ref_ru(self, obj):
        if obj.lesson_type == 'practice':
            prev = Lesson.objects.filter(module=obj.module, order=obj.order - 1, lesson_type='theory').first()
            return prev.content_ru if prev else ""
        return ""

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSimpleSerializer(many=True, read_only=True)
    title = serializers.CharField(source='title_en', read_only=True)
    description = serializers.CharField(source='description_en', read_only=True)
    
    class Meta:
        model = Module
        fields = ('id', 'title', 'title_en', 'title_ru', 'order', 'description', 'description_en', 'description_ru', 'lessons')

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    title = serializers.CharField(source='title_en', read_only=True)
    description = serializers.CharField(source='description_en', read_only=True)
    
    class Meta:
        model = Course
        fields = ('slug', 'title', 'title_en', 'title_ru', 'description', 'description_en', 'description_ru', 'modules')

class UserLessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonProgress
        fields = '__all__'
