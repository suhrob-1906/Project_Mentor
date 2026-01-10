from rest_framework import serializers
from .models import Submission, AnalysisResult, Roadmap, ProjectRecommendation

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
