from django.urls import path
from .views import AnalyzeView, RoadmapView, ProjectView, TestQuestionsView, SubmitTestView

urlpatterns = [
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
    path('roadmap/', RoadmapView.as_view(), name='roadmap'),
    path('projects/', ProjectView.as_view(), name='projects'),
    path('questions/', TestQuestionsView.as_view(), name='questions'),
    path('submit-test/', SubmitTestView.as_view(), name='submit-test'),
]
