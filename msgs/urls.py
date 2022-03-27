from django.urls import path

from .views import DialogAPIView, MessageAPIView, FindAPIView

urlpatterns = [
    path('dialog/', DialogAPIView.as_view()),
    path('dialog/<int:pk>/', DialogAPIView.as_view()),
    path('message/', MessageAPIView.as_view()),
    path('message/<int:pk>/', MessageAPIView.as_view()),
    path('find/', FindAPIView.as_view())
]
