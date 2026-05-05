#!/bin/sh
set -e

echo "Waiting for database..."
while ! python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookly.settings')
django.setup()
from django.db import connection
connection.ensure_connection()
" 2>/dev/null; do
    sleep 1
done
echo "Database ready!"

echo "Creating migrations..."
python manage.py makemigrations booklyApp --noinput

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Seeding database..."
python manage.py seed

echo "Starting Gunicorn..."
exec gunicorn bookly.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
