from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.services import auth
from .services import get_instance_and_check_access
from .models import Article, Comment, File
from authentication.models import User
from .serializers import ArticleSerializer, CommentSerializer
from authentication.serializers import UserSerializer
from .services import set_comments_to_article


class UserAPIView(APIView):
    user_serializer_class = UserSerializer
    article_serializer_class = ArticleSerializer
    comment_serializer_class = CommentSerializer

    def get(self, request, pk=None):
        user = get_object_or_404(User, pk=pk or request.user.pk)
        serializer = self.user_serializer_class(instance=user)
        user = serializer.data
        user['owner'] = request.user.pk == pk
        articles = Article.objects.filter(user_id=pk or request.user.pk)
        serializer = self.article_serializer_class(instance=articles, many=True)
        articles = serializer.data
        set_comments_to_article(self.comment_serializer_class, articles)
        file = File.objects.filter(user_id=pk or request.user.pk)
        if file:
            user['photo'] = 'media/' + str(file.latest('pk').file)
        return Response({"user": user, "articles": articles}, status=status.HTTP_200_OK)

    @auth
    def put(self, request):
        photo = []
        for filename, file in request.FILES.items():
            instance = File(file=file, user_id=request.user.pk)
            instance.save()
            photo.append({'id': str(instance.pk), 'url': 'media/' + str(instance.file)})
        data = request.data
        instance = User.objects.get(pk=request.user.pk)
        serializer = self.user_serializer_class(instance=instance,
                                                data=data,
                                                partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)


class ArticleAPIView(APIView):
    serializer_class = ArticleSerializer

    def get(self, request, pk=None):
        page = get_object_or_404(Article, id=pk)
        serializer = self.serializer_class(instance=page)
        page = serializer.data
        return Response(page, status=status.HTTP_200_OK)

    @auth
    def post(self, request):
        data = request.data
        data['user'] = request.user.pk
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"id": serializer.data.get('id', None)},
                        status=status.HTTP_201_CREATED)

    @auth
    def put(self, request, pk):
        data = request.data
        article = get_instance_and_check_access(request, Article, pk, 'user_id')
        serializer = self.serializer_class(instance=article,
                                           data=data,
                                           partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)

    @auth
    def delete(self, request, pk):
        article = get_instance_and_check_access(request, Article, pk, 'user_id')
        article.delete()
        return Response(status=status.HTTP_200_OK)


class CommentAPIView(APIView):
    serializer_class = CommentSerializer

    def get(self, request, pk=None):
        comment = get_object_or_404(Comment, id=pk)
        serializer = self.serializer_class(instance=comment)
        comment = serializer.data
        return Response(comment, status=status.HTTP_200_OK)

    @auth
    def post(self, request, pk):
        data = request.data
        data['article'] = pk
        data['user'] = request.user.pk
        serializer = self.serializer_class(data=data)
        valid = serializer.is_valid()
        if not valid:
            return Response({"error": "Please try again."}, status=status.HTTP_404_NOT_FOUND)
        serializer.save()
        return Response({"id": serializer.data.get('id', None)},
                        status=status.HTTP_201_CREATED)

    @auth
    def put(self, request, pk):
        data = request.data
        comment = get_instance_and_check_access(request, Comment, pk, 'user_id')
        serializer = self.serializer_class(instance=comment,
                                           data=data,
                                           partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_200_OK)

    @auth
    def delete(self, request, pk):
        comment = get_instance_and_check_access(request, Comment, pk, 'user_id')
        comment.delete()
        return Response(status=status.HTTP_200_OK)
