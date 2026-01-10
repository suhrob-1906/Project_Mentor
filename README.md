# AI Programming Mentor Platform

A production-ready platform that analyzes code to generate personalized learning roadmaps and portfolio projects.

## Project Structure
*   **backend/**: Django + DRF + SQLite/Postgres (API)
*   **frontend/**: React + Vite + Tailwind CSS (UI)

## Quick Start (Local Development)

### Prerequisites
*   Python 3.10+
*   Node.js 18+

### 1. Setup Backend
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs on `http://127.0.0.1:8000` (or 8001 if configured).

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Deployment

### Backend (Railway/Render)
1.  Set environment variables: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `DATABASE_URL` (for Postgres).
2.  Use `gunicorn config.wsgi:application` as start command.
3.  Install `dj-database-url` and `psycopg2-binary` for Postgres.

### Frontend (Vercel/Netlify)
1.  Connect repository.
2.  Build command: `npm run build`.
3.  Output directory: `dist`.
4.  Set `VITE_API_URL` env var if needed (currently hardcoded to localhost in api.js - CHANGE THIS for prod).

## Features
*   **Skill Analysis**: Heuristic analysis of Python/JS code.
*   **Roadmaps**: Custom learning paths.
*   **Projects**: Real-world project ideas.
