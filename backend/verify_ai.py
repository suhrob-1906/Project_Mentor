import os
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini using the new google-genai library
api_key = os.environ.get("GOOGLE_API_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY not found in .env. Please add it first.")
    exit(1)

client = genai.Client(api_key=api_key)

def analyze_test_results(language, category, score, total, wrong_answers, is_child=False):
    """
    Simulates the AI analysis of a finished level.
    """
    
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
        response = client.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# Example Test Data
if __name__ == "__main__":
    print("-" * 30)
    print("--- Testing AI Mentor (Adult Mode) ---")
    print("-" * 30)
    feedback = analyze_test_results(
        language="Python",
        category="OOP",
        score=2,
        total=5,
        wrong_answers=["What is a decorator?", "Difference between @classmethod and @staticmethod"],
        is_child=False
    )
    print(feedback)
    
    print("\n" + "-" * 30)
    print("--- Testing AI Mentor (Child Mode) ---")
    print("-" * 30)
    feedback_child = analyze_test_results(
        language="JavaScript",
        category="Basics",
        score=3,
        total=5,
        wrong_answers=["How to create a variable?", "What is an alert?"],
        is_child=True
    )
    print(feedback_child)
