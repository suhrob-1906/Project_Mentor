# Backend - AI Mentor

Django REST Framework API.

## Setup
1. `python -m venv venv`
2. `pip install -r requirements.txt`
3. `python manage.py migrate`
4. `python manage.py runserver`

## API Endpoints
*   `POST /auth/register/`
*   `POST /auth/login/`
*   `POST /api/analyze/` (Upload code)
*   `GET /api/roadmap/`
*   `GET /api/projects/`

## Deployment
*   Ensure `DEBUG=False`.
*   Configure `ALLOWED_HOSTS`.
*   Use PostgreSQL.
