from django.urls import path

from .views import UserAPIView, ArticleAPIView, CommentAPIView

urlpatterns = [
    path('user/', UserAPIView.as_view()),
    path('user/<int:pk>/', UserAPIView.as_view()),
    path('article/', ArticleAPIView.as_view()),
    path('article/<int:pk>/', ArticleAPIView.as_view()),
    path('comment/', CommentAPIView.as_view()),
    path('comment/<int:pk>/', CommentAPIView.as_view()),
]
