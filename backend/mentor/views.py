from rest_framework import views, generics, permissions, status
from rest_framework.response import Response
from .models import Submission, AnalysisResult, Roadmap, ProjectRecommendation, TestQuestion, TestResult, UserProgress, Homework, Course, Module, Lesson, UserLessonProgress, ChatSession, ChatMessage, CourseReport
from .serializers import (
    SubmissionSerializer, RoadmapSerializer, ProjectRecommendationSerializer,
    TestQuestionSerializer, TestResultSerializer, CourseSerializer, LessonDetailSerializer, UserLessonProgressSerializer
)
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from .services.ai_service import GeminiService

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['user'] = self.request.user
        return ctx

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['user'] = self.request.user
        return ctx

    @action(detail=True, methods=['post'])
    def check(self, request, slug=None):
        lesson = self.get_object()
        code = request.data.get('code', '')
        task_index = request.data.get('task_index', 0)
        
        passed = False
        feedback = "Check failed."
        
        # 1. Verification Logic
        if lesson.lesson_type == 'practice':
            tasks = lesson.practice_tasks or []
            if task_index < len(tasks):
                task = tasks[task_index]
                # If there's an expected_output, we ideally execute. 
                # For now, if code is not empty and they've tried, let it pass in MVP.
                # BETTER: Check for presence of task-specific keywords or logic.
                if len(code.strip()) > len(task.get('initial_code', '').strip()) + 5:
                    passed = True
                    feedback = f"Task {task_index + 1} passed! 🌟"
                else:
                    feedback = "Try to implement more logic for this task."
            else:
                passed = True # All tasks done?
        else:
            # Theory check? Handle "Repeat Code" here if needed, 
            # but usually frontend handles theory steps.
            passed = True
            feedback = "Theory understood."
             
        # 2. Update Progress
        if passed:
            prog, _ = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
            
            # If it's a practice lesson, we only mark final complete if last task is done
            # For simplicity in this logic:
            if lesson.lesson_type == 'practice':
                tasks = lesson.practice_tasks or []
                if task_index == len(tasks) - 1 or not tasks:
                    prog.is_completed = True
            else:
                prog.is_completed = True
                
            prog.user_code = code
            prog.save()
            
            # Unlock logic remains...
            if prog.is_completed:
                # Same unlocking logic as before
                next_lesson = Lesson.objects.filter(module=lesson.module, order=lesson.order + 1).first()
                if not next_lesson:
                    next_mod = Module.objects.filter(course=lesson.module.course, order=lesson.module.order + 1).first()
                    if next_mod:
                        next_lesson = next_mod.lessons.first()
                if next_lesson:
                     next_prog, _ = UserLessonProgress.objects.get_or_create(user=request.user, lesson=next_lesson)
                     next_prog.is_unlocked = True
                     next_prog.save()

        return Response({
            "passed": passed,
            "feedback": feedback
        })

    @action(detail=True, methods=['post'])
    def hint(self, request, slug=None):
        lesson = self.get_object()
        user_code = request.data.get('code', '')
        
        from .services.ai_service import GeminiService
        ai = GeminiService()
        
        # Context: "language" might be inferred from course slug or a property
        # For now, let's assume 'python' if lesson.module.course.slug == 'backend' etc.
        course_slug = lesson.module.course.slug
        lang = 'python' if 'backend' in course_slug else 'javascript'
        
        # Use content_en as task description for AI context
        task_desc = lesson.content_en 
        
        hint_text = ai.generate_hint(lang, task_desc, user_code)
        
        return Response({"hint": hint_text})

    @action(detail=True, methods=['post'])
    def explain(self, request, slug=None):
        lesson = self.get_object()
        user_code = request.data.get('code', '')
        error_msg = request.data.get('error', 'Unknown Error')
        
        from .services.ai_service import GeminiService
        ai = GeminiService()
        course_slug = lesson.module.course.slug
        lang = 'python' if 'backend' in course_slug else 'javascript'
        task_desc = lesson.content_en 
        
        explanation = ai.explain_error(lang, task_desc, user_code, error_msg)
        
        return Response({"explanation": explanation})

from .services.roadmap import RoadmapGenerator
from .services.projects import ProjectGenerator
from .services.ai_service import GeminiService
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

class UserProgressView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        language = request.query_params.get('language', 'python').lower()
        progress, created = UserProgress.objects.get_or_create(user=request.user, language=language)
        
        # Ensure 'basics' is always unlocked for new users
        if not progress.unlocked_categories:
            progress.unlocked_categories = ['basics']
            progress.save()
            
        return Response({
            "unlocked": progress.unlocked_categories,
            "completed": progress.completed_categories
        })

class HomeworkView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        language = request.query_params.get('language', 'python').lower()
        homeworks = Homework.objects.filter(user=request.user, language=language).order_by('-created_at')
        return Response([{
            "id": h.id,
            "category": h.category,
            "task": h.task_description,
            "status": h.status,
            "feedback": h.ai_feedback,
            "submission": h.submission_text,
            "attempts": h.attempts,
            "correct_solution": h.correct_solution
        } for h in homeworks])

    def post(self, request):
        hw_id = request.data.get('id')
        submission = request.data.get('submission')
        
        try:
            hw = Homework.objects.get(id=hw_id, user=request.user)
            hw.submission_text = submission
            hw.attempts += 1
            hw.status = 'submitted'
            hw.save()
            
            # AI Check
            ai = GeminiService()
            passed, feedback = ai.check_homework(hw.language, hw.task_description, submission)
            
            if passed:
                hw.status = 'passed'
                hw.ai_feedback = feedback
            else:
                hw.status = 'failed'
                hw.ai_feedback = feedback
                # Check for 3 failures
                if hw.attempts >= 3:
                    # Generate official solution
                    solution = ai.get_homework_solution(hw.language, hw.task_description)
                    hw.correct_solution = solution
                    # We might still keep status as 'failed' but the solution will be visible
            
            hw.save()
            
            return Response({
                "passed": passed,
                "feedback": feedback,
                "attempts": hw.attempts,
                "correct_solution": hw.correct_solution
            })
        except Homework.DoesNotExist:
            return Response({"error": "Homework not found"}, status=404)

class DynamicQuestionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        language = request.query_params.get('language', 'python').lower()
        category = request.query_params.get('category', 'basics').lower()
        
        from .services.ai_service import GeminiService
        import json
        
        ai = GeminiService()
        prompt = f"""
        Generate 5 multiple choice questions for {language} learners on theme '{category}'.
        Response MUST be a JSON list of objects:
        [
            {{
                "id": "temp_1",
                "text_en": "Question text...",
                "text_ru": "Текст вопроса...",
                "options_en": ["A", "B", "C", "D"],
                "options_ru": ["А", "Б", "В", "Г"],
                "correct_option": 0
            }}
        ]
        """
        
        try:
            response = ai.model.generate_content(prompt)
            # Remove markdown code blocks if present
            clean_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            questions = json.loads(clean_text)
            return Response(questions)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

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
        category = request.query_params.get('category', 'basics').lower()
        
        # Get questions for the language and category
        questions = TestQuestion.objects.filter(language=language, category=category)
        
        # Hybrid Logic: If we have less than 10 questions, generate more using AI
        if questions.count() < 10:
            from .services.ai_service import GeminiService
            ai = GeminiService()
            needed = 10 - questions.count()
            # Generate and save to DB
            ai.generate_and_save_questions(language, category, count=needed)
            # Re-fetch after generation
            questions = TestQuestion.objects.filter(language=language, category=category)

        # If still no questions for this category (e.g. AI failed or newly seeded), fallback to any for that language
        if not questions.exists():
            questions = TestQuestion.objects.filter(language=language)
            
        if questions.count() > 10:
            import random
            questions = random.sample(list(questions), 10)
        
        serializer = TestQuestionSerializer(questions, many=True)
        return Response(serializer.data)

class SubmitTestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            language = (request.data.get('language') or 'python').lower()
            category = (request.data.get('category') or 'basics').lower()
            answers = request.data.get('answers') # List of {"id": question_id, "option": selected_index}
            
            if not answers:
                return Response({"error": "No answers provided"}, status=400)

            # Calculate score and collect wrong concepts for AI
            total = len(answers)
            correct_count = 0
            wrong_concepts = []
            
            for ans in answers:
                try:
                    q = TestQuestion.objects.get(id=ans['id'])
                    if q.correct_option == ans['option']:
                        correct_count += 1
                    else:
                        # Collect the English text of the question as a concept hint for AI
                        wrong_concepts.append(q.text_en)
                except TestQuestion.DoesNotExist:
                    continue
            
            score_percent = (correct_count / total * 100) if total > 0 else 0
            is_child = request.user.age <= 14
            passed = score_percent >= 70
            
            # Duolingo-style Progress Logic
            progress, created = UserProgress.objects.get_or_create(user=request.user, language=language)
            if not progress.unlocked_categories:
                progress.unlocked_categories = ['basics']
            
            # Update category score
            progress.completed_categories[category] = max(progress.completed_categories.get(category, 0), int(score_percent))
            
            # Unlock next level if passed
            if passed:
                categories = [c[0] for c in TestQuestion.CATEGORY_CHOICES]
                try:
                    curr_idx = categories.index(category)
                    if curr_idx < len(categories) - 1:
                        next_cat = categories[curr_idx + 1]
                        if next_cat not in progress.unlocked_categories:
                            progress.unlocked_categories.append(next_cat)
                except ValueError:
                    pass
            progress.save()

            # Determine level (for reporting)
            if score_percent < 40: level = 'beginner'
            elif score_percent < 70: level = 'junior'
            elif score_percent < 90: level = 'strong_junior'
            else: level = 'middle'

            # AI Feedback Integration
            ai = None
            ai_advice = None
            try:
                ai = GeminiService()
                ai_advice = ai.get_feedback(
                    language=language,
                    category=category,
                    score=correct_count,
                    total=total,
                    wrong_answers=wrong_concepts[:5], 
                    is_child=is_child
                )
            except Exception as e:
                print(f"AI Feedback failed: {e}")
                ai_advice = "AI Mentor is currently offline, but great job!"

            # Generate Homework Tasks (AI prioritized)
            tasks = []
            try:
                # Re-init service or reuse? Reuse is fine.
                if not ai: ai = GeminiService()
                tasks = ai.generate_homework(language, category, wrong_concepts, is_child)
            except Exception as e:
                print(f"AI Homework Gen failed: {e}")
            
            if not tasks:
                tasks = self._generate_tasks(language, level, is_child)
            
            # Create Homework objects for the user safely
            try:
                for task_desc in tasks:
                    # Avoid get_or_create on TextField for safety
                    if not Homework.objects.filter(user=request.user, language=language, category=category, task_description=task_desc).exists():
                        Homework.objects.create(
                            user=request.user,
                            language=language,
                            category=category,
                            task_description=task_desc,
                            status='assigned'
                        )
            except Exception as e:
                print(f"Homework saving failed: {e}")

            # Generate/Update Roadmap & Projects (Non-critical)
            roadmap_steps = []
            projects_data = []
            try:
                rg = RoadmapGenerator(language, level, request.user.goal)
                roadmap_steps = rg.generate()
                Roadmap.objects.create(user=request.user, title=f"Path for {level.title()} {language}", steps=roadmap_steps)
                
                ProjectRecommendation.objects.filter(user=request.user).delete()
                pg = ProjectGenerator(language, level)
                projects_data = pg.generate()
                for p in projects_data:
                    ProjectRecommendation.objects.create(user=request.user, **p)
            except Exception as e:
                print(f"Roadmap/Project gen failed: {e}")

            # Save Result
            result = TestResult.objects.create(
                user=request.user,
                language=language,
                category=category,
                score=correct_count,
                total_questions=total,
                level=level,
                ai_feedback=ai_advice,
                roadmap=roadmap_steps,
                projects=projects_data,
                tasks=tasks
            )

            return Response({
                "id": result.id,
                "passed": passed,
                "score": correct_count,
                "total": total,
                "percent": score_percent,
                "ai_feedback": ai_advice,
                "unlocked": progress.unlocked_categories,
                "level": level,
                "roadmap": roadmap_steps,
                "projects": projects_data,
                "tasks": tasks,
                "is_child": is_child
            })
        except Exception as e:
            # Catch-all for Critical Failures (DB connection etc)
            import traceback
            print(traceback.format_exc())
            return Response({"error": f"Critical Error: {str(e)}"}, status=500)

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
        
        # Use random.choices to allow repetitions if pool is small, preventing crashes
        import random
        selected = random.choices(level_tasks, k=count)
        
        # Add friendly icons for kids
        if is_child:
            return [f"🌟 {task}" for task in selected]
        
        return selected
class CompleteLessonView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        lesson_slug = request.data.get('lesson_slug')
        if not lesson_slug:
            return Response({"error": "lesson_slug is required"}, status=400)
            
        lesson = Lesson.objects.filter(slug=lesson_slug).first()
        if not lesson:
            return Response({"error": "Lesson not found"}, status=404)
            
        progress, created = UserLessonProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson
        )
        progress.is_completed = True
        progress.save()
        
        # Also ensure NEXT lesson is marked as unlocked in DB
        next_lesson = Lesson.objects.filter(module=lesson.module, order=lesson.order + 1).first()
        if next_lesson:
            next_prog, _ = UserLessonProgress.objects.get_or_create(
                user=request.user,
                lesson=next_lesson
            )
            next_prog.is_unlocked = True
            next_prog.save()
            
        return Response({"message": "Lesson completed successfully"})

class MentorChatView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        lesson_slug = request.data.get('lesson_slug')
        message = request.data.get('message')
        user_code = request.data.get('code', '')
        
        if not message:
            return Response({"error": "Message is required"}, status=400)

        lesson = None
        if lesson_slug:
            lesson = Lesson.objects.filter(slug=lesson_slug).first()

        # Get or create active session for this lesson
        session, _ = ChatSession.objects.get_or_create(
            user=user, 
            lesson=lesson, 
            is_active=True
        )

        # Get last 10 messages for history
        history_msgs = session.messages.all()[:10]
        history = [
            {"role": m.role, "content": m.content} 
            for m in history_msgs
        ]

        # Save user message
        ChatMessage.objects.create(session=session, role='user', content=message)

        # AI Mentor Context
        context_info = {
            "language": lesson.module.course.slug if lesson else "Programming",
            "lesson_title": lesson.title_en if lesson else "General Help",
            "lesson_content": lesson.content_en if lesson else "",
            "user_code": user_code
        }

        is_child = user.age <= 14 if hasattr(user, 'age') else False
        
        ai = GeminiService()
        ai_response = ai.mentor_chat(history, message, context_info, is_child=is_child)

        # Save mentor response
        ChatMessage.objects.create(session=session, role='mentor', content=ai_response)

        return Response({
            "response": ai_response,
            "session_id": session.id
        })

    def get(self, request):
        lesson_slug = request.query_params.get('lesson_slug')
        lesson = None
        if lesson_slug:
            lesson = Lesson.objects.filter(slug=lesson_slug).first()
        
        session = ChatSession.objects.filter(user=request.user, lesson=lesson, is_active=True).first()
        
        if not session:
            return Response([])
            
        msgs = session.messages.all()
        return Response([
            {"role": m.role, "content": m.content, "created_at": m.created_at}
            for m in msgs
        ])

class GenerateReportView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        course_slug = request.data.get('course_slug')
        course = Course.objects.filter(slug=course_slug).first()
        if not course:
            return Response({"error": "Course not found"}, status=404)

        # Gather progress metrics
        user = request.user
        lesson_progress = UserLessonProgress.objects.filter(user=user, lesson__module__course=course)
        
        completed_count = lesson_progress.filter(is_completed=True).count()
        total_count = Lesson.objects.filter(module__course=course).count()
        
        # Simple analysis
        is_child = user.age <= 14 if hasattr(user, 'age') else False
        
        # AI Logic
        ai = GeminiService()
        history = [] # No chat history needed for report
        context = {
            "type": "final_report",
            "course": course.title_en,
            "completion": f"{completed_count}/{total_count}",
            "is_child": is_child
        }
        
        # Generate Report using a specialized system prompt
        report_en = ai.generate_final_report(context, lang='en')
        report_ru = ai.generate_final_report(context, lang='ru')
        
        report_obj = CourseReport.objects.create(
            user=user,
            course=course,
            content_en=report_en,
            content_ru=report_ru,
            analysis_data={
                "completed": completed_count,
                "total": total_count,
                "is_child": is_child
            }
        )
        
        return Response({
            "report_en": report_en,
            "report_ru": report_ru,
            "id": report_obj.id
        })
