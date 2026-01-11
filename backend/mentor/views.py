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
        language = request.query_params.get('language', 'python').lower()
        # Get 20 random questions for the language
        questions = TestQuestion.objects.filter(language=language)
        if questions.count() > 20:
            questions = random.sample(list(questions), 20)
        
        serializer = TestQuestionSerializer(questions, many=True)
        response_data = serializer.data
        
        # Add metadata for debugging
        if not response_data:
            from django.db import connection
            print(f"[DEBUG] No questions found for {language}. Current DB: {connection.vendor}")
            print(f"[DEBUG] Total questions in DB: {TestQuestion.objects.count()}")

        return Response(response_data)

class SubmitTestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        language = (request.data.get('language') or 'python').lower()
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

        # Limit projects to 1
        pg = ProjectGenerator(language, level)
        projects_data = pg.generate()[:1]

        # Generate Tasks (3 for kids, 5 for adults)
        tasks = self._generate_tasks(language, level, is_child)

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

    def _generate_tasks(self, language, level, is_child):
        # Basic task sets
        all_tasks = {
            'python': {
                'beginner': ["Write a basic calculator", "Create a loop that prints prime numbers", "Build a guessing game", "List all files in a folder", "Calculate area of a circle"],
                'junior': ["Build a web scraper with BeautifulSoup", "Create a simple CRUD with Flask", "Automate email sending", "Parse a CSV file", "Create a basic CLI tool"],
                'strong_junior': ["Implement a decorator for logging", "Write unit tests for a library", "Design a simple API with Django", "Optimize a dictionary search", "Handle JSON data from an API"],
                'middle': ["Design a microservice using FastAPI", "Optimize a slow SQL query with Django ORM", "Implement a custom caching layer", "Build a real-time notification system", "Architect a scalable backend"]
            },
            'javascript': {
                'beginner': ["Create a To-Do list with vanilla JS", "Build a countdown timer", "Change background color on click", "Validate a simple form", "Create a digital clock"],
                'junior': ["Fetch data from an API and display it", "Use localStorage to save user preferences", "Build a photo gallery", "Implement a search filter", "Create a toggle-able accordion"],
                'strong_junior': ["Implement a custom React Hook", "Setup routing with React Router", "Build a state-managed store", "Handle async data with Redux", "Integrate a 3rd party library"],
                'middle': ["Build a real-time chat with Socket.io", "Setup Next.js with SSR", "Optimize bundle size", "Implement advanced animations", "Architect an enterprise React app"]
            },
            'go': {
                'beginner': ["Hello world with Go routines", "Write a program that reads a JPG", "Simple CLI flag parser", "Math operations", "String manipulation"],
                'junior': ["Create a concurrent URL checker", "Build a REST API with Fiber", "Handle JSON files", "Simple TCP echo server", "File encryption tool"],
                'middle': ["Implement a worker pool", "Design a CLI tool for file encryption", "Optimize memory usage", "Build a high-performance proxy", "Microservice communication"]
            },
            'java': {
                'beginner': ["Inheritance example with Animals", "File IO basics", "Simple geometry shapes", "Calculator", "User Input handling"],
                'junior': ["Spring Boot Hello World", "Connect to MySQL with JDBC", "Build a library manager", "HTTP Client example", "Unit testing with JUnit"],
                'middle': ["Microservices with Spring Cloud", "JVM performance tuning basics", "Hibernate optimizations", "Multithreading systems", "Enterprise patterns"]
            }
        }
        
        lang_tasks = all_tasks.get(language, {})
        level_tasks = lang_tasks.get(level, lang_tasks.get('junior', ["Explore the official documentation"]))
        
        # Enforce counts: 3 for kids, 5 for adults
        count = 3 if is_child else 5
        if not level_tasks:
             return [f"Complete your {language} quest!"] * count
             
        # Add friendly icons for kids
        if is_child:
            return [f"🌟 {task}" for task in random.sample(level_tasks * 2, count)]
        
        return random.sample(level_tasks * 2, count)
