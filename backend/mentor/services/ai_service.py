import os
import google.generativeai as genai
from django.conf import settings

class GeminiService:
    def __init__(self):
        self.api_key = os.environ.get("GOOGLE_API_KEY")
        if not self.api_key:
            # Fallback for local dev if not in env
            self.api_key = getattr(settings, 'GOOGLE_API_KEY', None)
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            
            # Try to initialize with a list of preferred models
            # Sometimes specific aliases like 'gemini-1.5-flash' might have issues on v1beta
            self.model = None
            for model_name in ['gemini-1.5-flash-001', 'gemini-1.5-flash', 'gemini-pro']:
                try:
                    # just verifying we can create the object, real check happens on generation
                    self.model = genai.GenerativeModel(model_name)
                    break 
                except:
                    continue
            
            if not self.model:
                 # Last resort
                 self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None

    def _generate_with_fallback(self, prompt):
        """Attempts to generate content using the current model, falling back if it fails."""
        if not self.api_key:
            raise Exception("AI not initialized (API Key missing)")
            
        # List of models to try in order (based on server availability)
        models_to_try = [
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-flash-latest',
            'gemini-2.5-pro',
            'gemini-2.0-flash-001'
        ]
        
        last_error = None
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                return response
            except Exception as e:
                last_error = e
                print(f"Model {model_name} failed: {e}")
                continue
        
        # If we get here, all models failed.
        # Try to diagnose by listing available models
        try:
            available = []
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    available.append(m.name)
            
            error_msg = f"All models failed. Available models on server: {available}. Last error: {last_error}"
            raise Exception(error_msg)
        except Exception as diag_e:
            # If diagnose fails (e.g. auth error), raise original
            raise Exception(f"All models failed and could not list models ({diag_e}). Last error: {last_error}")

    def get_feedback(self, language, category, score, total, wrong_answers, is_child=False):
        if not self.api_key:
            return "AI Mentor is currently unavailable (API Key missing)."

        prompt = f"""
        You are a professional IT Mentor. A student just finished a '{category}' test in {language}.
        Score: {score}/{total}.
        
        The student missed these questions (concepts they didn't understand):
        {wrong_answers}
        
        Task:
        1. Provide a very brief, encouraging feedback (in {'a friendly and fun' if is_child else 'a professional'} tone).
        2. Explain the core concept they missed in 1-2 sentences.
        3. Suggest one specific topic to focus on next.
        
        Language of response: Russian.
        """

        try:
            response = self._generate_with_fallback(prompt)
            return response.text
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "Quota" in error_str:
                return "ИИ устал и отдыхает (Лимит запросов исчерпан). Попробуйте через минуту!"
            return f"Ошибка ИИ: {error_str}"

    def generate_homework(self, language, category, wrong_concepts=[], is_child=False):
        if not self.api_key:
            return ["Реализуйте простую программу на выбранном языке."]

        concepts_text = ""
        if wrong_concepts:
            concepts_text = f"The student struggled with these concepts: {', '.join(wrong_concepts)}."

        count = 3 if is_child else 1

        prompt = f"""
        Generate {count} distinct practical homework task(s) for a student learning {language}.
        Level: {category}.
        Tone: {'fun and imaginative' if is_child else 'professional and challenging'}.
        {concepts_text}
        
        Task requirements:
        - Must be doable in 10-30 lines of code.
        - Focus on the core aspects of {category} and specifically address the mentioned struggles if any.
        - The description should be clear, concise, and practically useful.
        
        Language of response: Russian.
        
        Response format:
        Return ONLY a JSON list of strings. Example:
        ["Task 1 description...", "Task 2 description..."]
        """

        try:
            response = self._generate_with_fallback(prompt)
            import json
            clean_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            tasks = json.loads(clean_text)
            if isinstance(tasks, str): return [tasks]
            return tasks
        except Exception as e:
            return [f"Напишите программу, использующую концепции {category}."]

    def check_homework(self, language, task, submission):
        if not self.api_key:
            return True, "API Key missing, automatically passed."

        prompt = f"""
        You are an IT Mentor. A student submitted code for this task:
        "{task}"
        
        Student's submission:
        "{submission}"
        
        Language: {language}.
        
        Task:
        1. Evaluate if the code correctly solves the task.
        2. Provide brief feedback (Russian).
        3. Start your response with 'PASSED' or 'FAILED'.
        
        Format:
        PASSED/FAILED
        [Feedback text]
        """

        try:
            response = self._generate_with_fallback(prompt)
            text = response.text
            passed = text.strip().startswith("PASSED")
            feedback = text.replace("PASSED", "").replace("FAILED", "").strip()
            return passed, feedback
        except Exception as e:
            return False, f"Ошибка проверки: {str(e)}"

    def generate_and_save_questions(self, language, category, count=5):
        if not self.api_key:
            return []

        import json
        from mentor.models import TestQuestion

        prompt = f"""
        Generate {count} unique multiple choice questions for {language} learners on theme '{category}'.
        Response MUST be a JSON list of objects:
        [
            {{
                "text_en": "Question text...",
                "text_ru": "Текст вопроса...",
                "options_en": ["A", "B", "C", "D"],
                "options_ru": ["А", "Б", "В", "Г"],
                "correct_option": 0,
                "difficulty": "junior"
            }}
        ]
        """

        try:
            response = self._generate_with_fallback(prompt)
            clean_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            
            new_questions = []
            for item in data:
                q = TestQuestion.objects.create(
                    language=language,
                    category=category,
                    text_en=item['text_en'],
                    text_ru=item['text_ru'],
                    options_en=item['options_en'],
                    options_ru=item['options_ru'],
                    correct_option=item['correct_option'],
                    difficulty=item.get('difficulty', 'junior')
                )
                new_questions.append(q)
            return new_questions
        except Exception as e:
            print(f"Failed to generate questions: {e}")
            return []

    def get_homework_solution(self, language, task):
        if not self.api_key:
            return "Решение временно недоступно."

        prompt = f"""
        You are an IT Mentor. A student failed to solve this task 3 times:
        "{task}"
        
        Language: {language}.
        
        Task:
        1. Provide the most optimal and correct code solution.
        2. Explain step-by-step why this solution is correct and why it is the best approach.
        3. Mention common mistakes to avoid.
        
        Language of response: Russian.
        """

        try:
            response = self._generate_with_fallback(prompt)
            return response.text
        except Exception as e:
            return f"Не удалось получить решение: {str(e)}"
