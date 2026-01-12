#!/usr/bin/env python3
"""
Script to list all available Gemini models via google-genai SDK
"""
import os
from google import genai

# Get API key from environment
api_key = os.environ.get('GOOGLE_API_KEY')
if not api_key:
    print("❌ GOOGLE_API_KEY not found in environment")
    exit(1)

print(f"✅ API Key found: {api_key[:10]}...")

# Initialize client
client = genai.Client(api_key=api_key)

print("\n📋 Available models:")
print("-" * 80)

try:
    # List all models
    models = client.models.list()
    
    for model in models:
        print(f"\n✅ Model: {model.name}")
        print(f"   Display Name: {model.display_name}")
        print(f"   Supported Methods: {', '.join(model.supported_generation_methods)}")
        
except Exception as e:
    print(f"\n❌ Error listing models: {e}")
    print("\nTrying alternative approach...")
    
    # Try common model names
    test_models = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash-exp',
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'models/gemini-2.0-flash-exp',
    ]
    
    for model_name in test_models:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents="Hello"
            )
            print(f"✅ {model_name} - WORKS!")
        except Exception as err:
            print(f"❌ {model_name} - {str(err)[:100]}")
