from django.urls import path
from .views import AnalyzeView, RoadmapView, ProjectView, TestQuestionsView, SubmitTestView, UserProgressView, HomeworkView, DynamicQuestionView

urlpatterns = [
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
    path('roadmap/', RoadmapView.as_view(), name='roadmap'),
    path('projects/', ProjectView.as_view(), name='projects'),
    path('questions/', TestQuestionsView.as_view(), name='questions'),
    path('submit-test/', SubmitTestView.as_view(), name='submit-test'),
    path('progress/', UserProgressView.as_view(), name='progress'),
    path('homework/', HomeworkView.as_view(), name='homework'),
    path('dynamic-questions/', DynamicQuestionView.as_view(), name='dynamic-questions'),
]
