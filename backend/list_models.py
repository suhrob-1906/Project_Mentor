import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("GOOGLE_API_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY not found")
    exit(1)

client = genai.Client(api_key=api_key)

print("--- Listing Available Models ---")
try:
    # In the new SDK, we might need to iterate through models
    for model in client.models.list():
        print(f"Model ID: {model.name}, Supported: {model.supported_actions}")
except Exception as e:
    print(f"Error listing models: {str(e)}")
