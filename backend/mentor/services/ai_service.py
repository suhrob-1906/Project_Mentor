import os
from google import genai
from django.conf import settings

class GeminiService:
    def __init__(self):
        self.api_key = os.environ.get("GOOGLE_API_KEY")
        if not self.api_key:
            # Fallback for local dev if not in env
            self.api_key = getattr(settings, 'GOOGLE_API_KEY', None)
        
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def get_feedback(self, language, category, score, total, wrong_answers, is_child=False):
        if not self.client:
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
            response = self.client.models.generate_content(
                model='models/gemini-1.5-flash',
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Ошибка ИИ: {str(e)}"

    def generate_homework(self, language, category, is_child=False):
        if not self.client:
            return "Реализуйте простую программу на выбранном языке."

        prompt = f"""
        Assign a small, practical homework task for a student learning {language}.
        Level: {category}.
        Tone: {'fun and imaginative' if is_child else 'professional and challenging'}.
        
        Task requirements:
        - Must be doable in 10-20 lines of code.
        - Focus on the core aspects of {category}.
        - The description should be clear and concise.
        
        Language of response: Russian.
        """

        try:
            response = self.client.models.generate_content(
                model='models/gemini-1.5-flash',
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Не удалось создать задание: {str(e)}"

    def check_homework(self, language, task, submission):
        if not self.client:
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
            response = self.client.models.generate_content(
                model='models/gemini-1.5-flash',
                contents=prompt
            )
            text = response.text
            passed = text.strip().startswith("PASSED")
            feedback = text.replace("PASSED", "").replace("FAILED", "").strip()
            return passed, feedback
        except Exception as e:
            return False, f"Ошибка проверки: {str(e)}"

    def generate_and_save_questions(self, language, category, count=5):
        if not self.client:
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
            response = self.client.models.generate_content(
                model='models/gemini-1.5-flash',
                contents=prompt
            )
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
        if not self.client:
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
            response = self.client.models.generate_content(
                model='models/gemini-1.5-flash',
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Не удалось получить решение: {str(e)}"
