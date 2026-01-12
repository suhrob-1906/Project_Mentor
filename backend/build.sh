#!/usr/bin/env bash
# exit on error
set -o errexit

# Clear pip cache to ensure fresh install
pip cache purge || true

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
