from django.db import models
from django.conf import settings

class Submission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    github_url = models.URLField(blank=True, null=True)
    code_text = models.TextField(blank=True, null=True) # For direct paste if needed
    # File upload handling is tricky without S3/media config, let's stick to text/url for MVP or add FileField later.
    # But requirement said "zip or text". I'll add FileField but need to set MEDIA_ROOT.
    code_file = models.FileField(upload_to='submissions/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at}"

class AnalysisResult(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('junior', 'Junior'),
        ('strong_junior', 'Strong Junior'),
        ('middle', 'Middle'),
    ]
    submission = models.OneToOneField(Submission, on_delete=models.CASCADE, related_name='result')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    feedback = models.TextField() # Markdown or text
    metrics = models.JSONField(default=dict) # {"sloc": 100, "complexity": 5}
    created_at = models.DateTimeField(auto_now_add=True)

class Roadmap(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='roadmaps')
    title = models.CharField(max_length=255, default="My Learning Path")
    steps = models.JSONField() # List of {"topic": "", "description": "", "resources": []}
    created_at = models.DateTimeField(auto_now_add=True)

class ProjectRecommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    description = models.TextField()
    tech_stack = models.JSONField() # ["React", "Django"]
    features = models.JSONField() # ["Auth", "Dashboard"]
    created_at = models.DateTimeField(auto_now_add=True)

class TestQuestion(models.Model):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('go', 'Go'),
        ('java', 'Java'),
    ]
    CATEGORY_CHOICES = [
        ('basics', '1. Основы и Типы данных'),
        ('logic', '2. Переменные и Логика'),
        ('arrays', '3. Списки и Коллекции'),
        ('functions', '4. Функции и Методы'),
        ('objects', '5. Объекты и Классы'),
        ('errors', '6. Обработка ошибок'),
        ('async', '7. Асинхронность'),
        ('apis', '8. Работа с API и Сетью'),
        ('patterns', '9. Архитектура и Паттерны'),
        ('final', '10. Финальное испытание'),
    ]
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='basics')
    text_en = models.TextField()
    text_ru = models.TextField()
    options_en = models.JSONField() # List of strings
    options_ru = models.JSONField() # List of strings
    correct_option = models.IntegerField() # index
    difficulty = models.CharField(max_length=20, choices=[('beginner', 'Beginner'), ('junior', 'Junior'), ('middle', 'Middle')])

    def __str__(self):
        return f"{self.language} - {self.category} - {self.text_en[:30]}"

class TestResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_results')
    language = models.CharField(max_length=20)
    category = models.CharField(max_length=50, default='basics')
    score = models.IntegerField()
    total_questions = models.IntegerField()
    level = models.CharField(max_length=20)
    ai_feedback = models.TextField(blank=True, null=True)
    roadmap = models.JSONField(default=list)
    projects = models.JSONField(default=list)
    tasks = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

class UserProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    language = models.CharField(max_length=20)
    unlocked_categories = models.JSONField(default=list) # e.g., ["basics", "functions"]
    completed_categories = models.JSONField(default=dict) # e.g., {"basics": 85, "functions": 40}
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'language')

class Homework(models.Model):
    STATUS_CHOICES = [
        ('assigned', 'Assigned'),
        ('submitted', 'Submitted'),
        ('passed', 'Passed'),
        ('failed', 'Failed'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='homeworks')
    language = models.CharField(max_length=20)
    category = models.CharField(max_length=50)
    task_description = models.TextField()
    submission_text = models.TextField(blank=True, null=True)
    correct_solution = models.TextField(blank=True, null=True)
    ai_feedback = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='assigned')
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.language} - {self.category} ({self.status})"
