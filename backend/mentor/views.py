from rest_framework import views, generics, permissions, status
from rest_framework.response import Response
from .models import Submission, AnalysisResult, Roadmap, ProjectRecommendation, TestQuestion, TestResult
from .serializers import (
    SubmissionSerializer, RoadmapSerializer, ProjectRecommendationSerializer,
    TestQuestionSerializer, TestResultSerializer
)
from .services.analyzer import CodeAnalyzer
from .services.roadmap import RoadmapGenerator
from .services.projects import ProjectGenerator
import random

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
            "projects": projects_data,
            "is_child": request.user.age <= 14,
            "age": request.user.age
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

class TestQuestionsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        language = request.query_params.get('language', 'python')
        # Get 20 random questions for the language
        questions = TestQuestion.objects.filter(language=language)
        if questions.count() > 20:
            questions = random.sample(list(questions), 20)
        
        serializer = TestQuestionSerializer(questions, many=True)
        return Response(serializer.data)

class SubmitTestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        language = request.data.get('language')
        answers = request.data.get('answers') # List of {"id": question_id, "option": selected_index}
        
        if not answers:
            return Response({"error": "No answers provided"}, status=400)

        # Determine level
        total = len(answers)
        correct_count = 0
        for ans in answers:
            try:
                q = TestQuestion.objects.get(id=ans['id'])
                if q.correct_option == ans['option']:
                    correct_count += 1
            except TestQuestion.DoesNotExist:
                continue
        
        score_percent = (correct_count / total * 100) if total > 0 else 0
        
        # Age-based level adjustment (softer evaluation for kids)
        is_child = request.user.age <= 14
        
        if score_percent < (30 if is_child else 40):
            level = 'beginner'
        elif score_percent < (60 if is_child else 70):
            level = 'junior'
        elif score_percent < (85 if is_child else 90):
            level = 'strong_junior'
        else:
            level = 'middle'

        # Generate simplified content for kids if needed
        # (In a real scenario, this would call different prompts or templates)
        
        # Generate components
        rg = RoadmapGenerator(language, level, request.user.goal)
        roadmap_steps = rg.generate()

        pg = ProjectGenerator(language, level)
        projects_data = pg.generate()

        # Generate Tasks (1-5 targets)
        tasks = self._generate_tasks(language, level)
        if is_child:
            tasks = [f"🌟 {task}" for task in tasks] # Add friendly icons

        # Save Result
        result = TestResult.objects.create(
            user=request.user,
            language=language,
            score=correct_count,
            total_questions=total,
            level=level,
            roadmap=roadmap_steps,
            projects=projects_data,
            tasks=tasks
        )

        return Response({
            "id": result.id,
            "level": level,
            "score": correct_count,
            "total": total,
            "roadmap": roadmap_steps,
            "projects": projects_data,
            "tasks": tasks,
            "is_child": is_child,
            "age": request.user.age
        })

    def _generate_tasks(self, language, level):
        # Basic task sets
        all_tasks = {
            'python': {
                'beginner': ["Write a basic calculator", "Create a loop that prints prime numbers"],
                'junior': ["Build a web scraper with BeautifulSoup", "Create a simple CRUD with Flask"],
                'strong_junior': ["Implement a decorator for logging", "Write unit tests for a library"],
                'middle': ["Design a microservice using FastAPI", "Optimize a slow SQL query with Django ORM"]
            },
            'javascript': {
                'beginner': ["Create a To-Do list with vanilla JS", "Build a countdown timer"],
                'junior': ["Fetch data from an API and display it", "Use localStorage to save user preferences"],
                'strong_junior': ["Implement a custom React Hook", "Setup routing with React Router"],
                'middle': ["Build a real-time chat with Socket.io", "Setup Next.js with SSR"]
            },
            'go': {
                'beginner': ["Hello world with Go routines", "Write a program that reads a JPG"],
                'junior': ["Create a concurrent URL checker", "Build a REST API with Fiber"],
                'middle': ["Implement a worker pool", "Design a CLI tool for file encryption"]
            },
            'java': {
                'beginner': ["Inheritance example with Animals", "File IO basics"],
                'junior': ["Spring Boot Hello World", "Connect to MySQL with JDBC"],
                'middle': ["Microservices with Spring Cloud", "JVM performance tuning basics"]
            }
        }
        
        lang_tasks = all_tasks.get(language, {})
        level_tasks = lang_tasks.get(level, lang_tasks.get('junior', ["Explore the official documentation"]))
        
        # Return 1-5 tasks
        count = min(len(level_tasks), 5)
        return random.sample(level_tasks, count) if level_tasks else []
