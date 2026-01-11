from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('go', 'Go'),
        ('other', 'Other'),
    ]

    GOAL_CHOICES = [
        ('job', 'Get a Job'),
        ('freelance', 'Freelance'),
        ('startup', 'Build a Startup'),
        ('hobby', 'Just for Fun'),
    ]

    primary_language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='python')
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='job')
    age = models.PositiveIntegerField(default=18)

    def __str__(self):
        return self.username
