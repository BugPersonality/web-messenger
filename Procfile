release: python manage.py migrate
web: uvicorn messenger.asgi:application --host 0.0.0.0 --port $PORT
