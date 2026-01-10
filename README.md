# MentorAI - AI-Powered Programming Mentor Platform

## 🎯 What is MentorAI?

MentorAI is an intelligent platform that analyzes your actual code to determine your true programming skill level, then generates a personalized learning roadmap and portfolio project recommendations to accelerate your career growth.

Unlike traditional coding assessment platforms that rely on quizzes or algorithmic challenges, MentorAI performs **static code analysis** on your real projects to evaluate complexity, code quality, patterns, and best practices—giving you an honest assessment of where you stand.

## 🚀 Purpose

**Stop guessing. Know your true code level.**

Many developers struggle to objectively assess their skills or know what to learn next. MentorAI solves this by:
- **Analyzing your actual code** (not quiz answers) to determine if you're a Beginner, Junior, Strong Junior, or Middle-level developer
- **Generating personalized roadmaps** tailored to your exact skill gaps and career goals
- **Recommending real-world portfolio projects** that solve actual business problems, not just another To-Do app

## ✨ Key Features

### 1. **Deep Code Analysis**
- Static analysis of Python and JavaScript code
- Evaluates cyclomatic complexity, code patterns, and best practices
- Identifies common mistakes and anti-patterns
- Provides detailed feedback with actionable recommendations

### 2. **Personalized Learning Roadmaps**
- Custom step-by-step learning paths based on your skill level
- Tailored to your primary programming language (Python, JavaScript, Java, C++, Go)
- Aligned with your career goal (Get a Job, Freelance, Build a Startup)
- Focuses on filling your specific knowledge gaps

### 3. **Portfolio Project Recommendations**
- 3-5 unique project ideas that match your skill level
- Business-value projects that solve real problems
- Complete with tech stack recommendations and feature lists
- Designed to impress potential employers or clients

### 4. **Modern, Intuitive UI**
- Clean, professional interface built with React and Tailwind CSS
- Responsive design that works on all devices
- Real-time analysis with loading states and error handling

## 👥 Target Audience

MentorAI is perfect for:
- **Self-taught developers** who want to know where they stand
- **Bootcamp graduates** looking to identify skill gaps before job hunting
- **Junior developers** seeking a clear path to mid-level positions
- **Career changers** who need guidance on what to learn next
- **Freelancers** wanting to build an impressive portfolio

## 🛠️ Tech Stack

### Backend
- **Django 6.0** - Robust Python web framework
- **Django REST Framework** - RESTful API development
- **JWT Authentication** - Secure token-based auth
- **Radon** - Python code metrics and complexity analysis
- **PostgreSQL/SQLite** - Database (SQLite for dev, PostgreSQL for production)

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

## 📦 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
```
Backend runs on `http://127.0.0.1:8001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🌐 Deployment

### Backend (Render/Railway)
1. Set environment variables:
   - `SECRET_KEY` - Django secret key
   - `DEBUG=False` - Disable debug mode
   - `ALLOWED_HOSTS` - Your domain
   - `DATABASE_URL` - PostgreSQL connection string
2. Build command: `./build.sh`
3. Start command: `gunicorn config.wsgi:application`

### Frontend (Vercel/Netlify)
1. Set environment variable:
   - `VITE_API_URL` - Your backend URL (e.g., `https://your-backend.onrender.com`)
2. Build command: `npm run build`
3. Output directory: `dist`

**⚠️ IMPORTANT**: The frontend will not work in production without setting `VITE_API_URL`!

See [.env.example](.env.example) for all required environment variables.

## 📝 How It Works

1. **Register/Login** - Create an account with your programming language and career goal
2. **Submit Code** - Paste your code or upload a file on the Dashboard
3. **Get Analysis** - Receive your skill level assessment with detailed feedback
4. **View Roadmap** - Get a personalized learning path tailored to your gaps
5. **Build Projects** - Start working on recommended portfolio projects

## 🔒 Security

- JWT-based authentication with access and refresh tokens
- Password validation and hashing
- CORS protection (configurable for production)
- Environment-based configuration for sensitive data

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Built with ❤️ to help developers grow their careers**
