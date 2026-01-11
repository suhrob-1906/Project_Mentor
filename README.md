# MentorAI - AI-Powered Programming Mentor Platform

## 🎯 What is MentorAI?

MentorAI is an intelligent platform that analyzes your programming skills to determine your true level, then generates a personalized learning roadmap, portfolio project recommendations, and practical coding tasks to accelerate your career growth.

Whether through **direct code analysis** or our new **comprehensive language tests**, MentorAI gives you an honest assessment of where you stand.

## 🚀 Purpose

**Stop guessing. Know your true code level.**

MentorAI helps developers:
- **Determine their level** (Beginner, Junior, Strong Junior, Middle) via specialized tests or code analysis.
- **Get personalized roadmaps** tailored to Python, JavaScript, Go, and Java.
- **Receive coding tasks** (1-5 practical assignments) to solidify knowledge.
- **Build portfolio projects** designed for real-world impact.
- **Study in their language** with full English and Russian support.

## ✨ Key Features

### 1. **Specialized Programming Tests**
- 20-question deep-dives for Python, JavaScript, Go, and Java.
- Evaluates core concepts, syntax, and advanced patterns.
- Randomly generated from a robust pool of questions.

### 2. **Deep Code Analysis**
- Static analysis of Python code for complexity and anti-patterns.
- Actionable feedback on naming, structure, and best practices.

### 3. **Personalized Learning Roadmaps**
- Step-by-step paths based on exact skill gaps.
- Tailored to career goals (Job, Freelance, Startup).

### 4. **Practical Coding Tasks**
- **NEW**: 1-5 specific coding challenges to practice after the assessment.

### 6. **Adaptive Age-Based UI**
- **NEW**: The platform now adapts its tone and visual style based on the user's age.
- **Child Mode (≤14)**: Features friendly icons, softer colors (rose/amber), and simplified learning paths.
- **Adult Mode (>14)**: Premium minimalist professional aesthetic.

## 🛠️ Tech Stack

### Backend
- **Django 6.0**, **DRF**, **JWT Auth**
- **Radon** (Static Analysis)
- **SQLite/PostgreSQL**

### Frontend
- **React 18**, **Vite**, **Tailwind CSS**
- **i18next** (Multilingual Support)
- **Lucide React** (Icons)

## 📦 Quick Start

### Backend
1. `cd backend`
2. `python -m venv venv`
3. Activate venv
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py seed_questions` (Seed the test database)
7. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---
**Built with ❤️ by an expert team to help you grow.**
