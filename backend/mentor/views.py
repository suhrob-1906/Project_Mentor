from rest_framework import views, generics, permissions, status
from rest_framework.response import Response
from .models import Submission, AnalysisResult, Roadmap, ProjectRecommendation
from .serializers import SubmissionSerializer, RoadmapSerializer, ProjectRecommendationSerializer
from .services.analyzer import CodeAnalyzer
from .services.roadmap import RoadmapGenerator
from .services.projects import ProjectGenerator

class AnalyzeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # 1. Save Submission
        code_text = request.data.get('code_text', '')
        # Handle file upload if present, read content for analysis
        if 'code_file' in request.FILES:
             # For simplicity, we might read file content here or Analyzer handles path.
             # Let's read text from file if code_text is empty
             f = request.FILES['code_file']
             if not code_text:
                 try:
                     code_text = f.read().decode('utf-8')
                 except:
                     return Response({"error": "Invalid file encoding. Please upload UTF-8 text/code."}, status=400)

        submission_data = {
            'code_text': code_text,
            'github_url': request.data.get('github_url'),
            'code_file': request.FILES.get('code_file')
        }
        
        # Validate and Save
        # We manually save user because Serializer read_only
        submission = Submission.objects.create(
            user=request.user,
            **{k:v for k,v in submission_data.items() if v}
        )

        # 2. Analyze
        analyzer = CodeAnalyzer(code_text, language=request.user.primary_language)
        analysis_data = analyzer.analyze()
        
        result = AnalysisResult.objects.create(
            submission=submission,
            level=analysis_data['level'],
            metrics=analysis_data['metrics'],
            feedback=analysis_data['feedback']
        )

        # 3. Generate Roadmap
        rg = RoadmapGenerator(request.user.primary_language, result.level, request.user.goal)
        roadmap_steps = rg.generate()
        
        # Clear old roadmaps? Or keep history? predefined: keep history but show latest.
        Roadmap.objects.create(
            user=request.user,
            title=f"Roadmap for {result.level.title()} {request.user.primary_language}",
            steps=roadmap_steps
        )

        # 4. Generate Projects
        pg = ProjectGenerator(request.user.primary_language, result.level)
        projects_data = pg.generate()
        
        # Clear old projects?
        ProjectRecommendation.objects.filter(user=request.user).delete()
        for p in projects_data:
            ProjectRecommendation.objects.create(
                user=request.user,
                **p
            )

        return Response({
            "submission_id": submission.id,
            "level": result.level,
            "feedback": result.feedback,
            "roadmap": roadmap_steps,
            "projects": projects_data
        })

class RoadmapView(generics.ListAPIView):
    serializer_class = RoadmapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Roadmap.objects.filter(user=self.request.user).order_by('-created_at')[:1]

class ProjectView(generics.ListAPIView):
    serializer_class = ProjectRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProjectRecommendation.objects.filter(user=self.request.user)
