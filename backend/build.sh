#!/usr/bin/env bash
# exit on error
set -o errexit

# Clear pip cache to ensure fresh install
pip cache purge || true

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

if [ "$RESET_DB" == "true" ]; then
    echo "⚠️ RESET_DB is set to true. Flushing database..."
    python manage.py flush --no-input
    echo "✅ Database flushed."
fi

python manage.py populate_courses
