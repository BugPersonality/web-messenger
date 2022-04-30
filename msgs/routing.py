from django.urls import path
from .consumers import MessageConsumer, DialogConsumer

websockets = [
    path('ws/<int:dialog_id>/', MessageConsumer.as_asgi()),
    path('ws/', DialogConsumer.as_asgi()),
]
