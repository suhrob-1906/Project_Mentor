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

class LessonSimpleSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'slug', 'title', 'order', 'is_completed', 'is_unlocked')

    def get_is_completed(self, obj):
        user = self.context.get('user')
        if user and user.is_authenticated:
            # Optimize this with prefetch later
            progress = UserLessonProgress.objects.filter(user=user, lesson=obj).first()
            return progress.is_completed if progress else False
        return False

    def get_is_unlocked(self, obj):
        user = self.context.get('user')
        if not user or not user.is_authenticated:
            return obj.order == 1 # First lesson always unlocked
        
        # Check explicit unlock
        progress = UserLessonProgress.objects.filter(user=user, lesson=obj).first()
        if progress and progress.is_unlocked:
            return True
            
        # Logic: If previous lesson completed, this is unlocked
        if obj.order == 1:
            return True
        
        # Find previous lesson in same module
        prev_lesson = Lesson.objects.filter(module=obj.module, order=obj.order - 1).first()
        if prev_lesson:
             prev_prog = UserLessonProgress.objects.filter(user=user, lesson=prev_lesson).first()
             return prev_prog.is_completed if prev_prog else False
             
        # If first lesson of module > 1, check previous module? 
        # For simplicity, let's assume strict sequential order or just use explicit is_unlocked if we manager it.
        # But simpler logic: user needs to complete previous lesson.
        return False

class LessonDetailSerializer(LessonSimpleSerializer):
    class Meta(LessonSimpleSerializer.Meta):
        fields = LessonSimpleSerializer.Meta.fields + ('theory_content', 'practice_task', 'initial_code', 'expected_output')

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSimpleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ('id', 'title', 'order', 'description', 'lessons')

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ('slug', 'title', 'description', 'modules')

class UserLessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonProgress
        fields = '__all__'
