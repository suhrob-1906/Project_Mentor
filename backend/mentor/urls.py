from django.urls import path
from .views import AnalyzeView, RoadmapView, ProjectView

urlpatterns = [
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
    path('roadmap/', RoadmapView.as_view(), name='roadmap'),
    path('projects/', ProjectView.as_view(), name='projects'),
]
