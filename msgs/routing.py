from django.urls import path
from .consumers import MessageConsumer

websockets = [
    path('ws/<int:dialog_id>/', MessageConsumer.as_asgi()),
]
