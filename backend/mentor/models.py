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
