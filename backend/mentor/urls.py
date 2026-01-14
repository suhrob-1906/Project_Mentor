from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnalyzeView, RoadmapView, ProjectView, TestQuestionsView, SubmitTestView, UserProgressView, HomeworkView, DynamicQuestionView, CourseViewSet, LessonViewSet, CompleteLessonView, MentorChatView, GenerateReportView

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
    path('roadmap/', RoadmapView.as_view(), name='roadmap'),
    path('projects/', ProjectView.as_view(), name='projects'),
    path('questions/', TestQuestionsView.as_view(), name='questions'),
    path('submit-test/', SubmitTestView.as_view(), name='submit-test'),
    path('lessons/complete/', CompleteLessonView.as_view(), name='complete-lesson'),
    path('mentor/chat/', MentorChatView.as_view(), name='mentor-chat'),
    path('courses/generate-report/', GenerateReportView.as_view(), name='generate-report'),
    path('progress/', UserProgressView.as_view(), name='progress'),
    path('homework/', HomeworkView.as_view(), name='homework'),
    path('dynamic-questions/', DynamicQuestionView.as_view(), name='dynamic-questions'),
]
