# Инструкция по Деплою (Render + Vercel)

## 1. Подготовка Бэкенда к Render.com

Render.com — отличный выбор для Django.

### Шаг 1: Подготовка файлов
Убедитесь, что в корне `backend/` есть эти файлы (я их уже создал):
1.  **requirements.txt**: Должен содержать `gunicorn`, `django`, `djangorestframework`, `dj-database-url`, `psycopg2-binary`.
    *   *Нужно обновить requirements.txt, чтобы добавить gunicorn и postgres драйверы.*
2.  **build.sh**: Скрипт для сборки на Render.

### Шаг 2: Создание build.sh
Создайте файл `backend/build.sh`:
```bash
#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
```

### Шаг 3: Настройка на Render
1.  Зарегистрируйтесь на [Render.com](https://render.com).
2.  Создайте "New Service" -> "Web Service".
3.  Подключите ваш GitHub репозиторий.
4.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `./build.sh`
    *   **Start Command**: `gunicorn config.wsgi:application`
    *   **Environment Variables**:
        *   `PYTHON_VERSION`: `3.10.0`
        *   `SECRET_KEY`: (придумайте сложный ключ)
        *   `DEBUG`: `False`
        *   `DATABASE_URL`: (Render создаст PostgreSQL базу, если вы добавите её, или используйте Internal URL). *Совет: Создайте отдельно PostgreSQL на Render и скопируйте Internal DB URL сюда.*
        *   `ALLOWED_HOSTS`: `*` (или ваш домен render.com)

## 2. Подготовка Фронтенда к Vercel/Netlify

### Шаг 1: Настройка API URL
В файле `frontend/src/api.js` сейчас стоит `http://127.0.0.1:8001`.
Для продакшена это нужно менять.
Лучший способ: Использовать переменную окружения.
В `frontend/src/api.js`:
```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';
```

### Шаг 2: Деплой на Vercel
1.  Зарегистрируйтесь на [Vercel.com](https://vercel.com).
2.  "Add New..." -> "Project".
3.  Imort Git Repository.
4.  **Settings**:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: Vite
    *   **Environment Variables**:
        *   `VITE_API_URL`: (Вставьте сюда URL вашего бэкенда с Render, например `https://my-django-app.onrender.com`)
5.  Deploy!

## 3. CORS (Важно!)
На бэкенде в `config/settings.py` нужно добавить домен фронтенда в `CORS_ALLOWED_ORIGINS`, если `CORS_ALLOW_ALL_ORIGINS = False`.
Для старта можно оставить `True`, но лучше настроить:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.vercel.app",
]
```
