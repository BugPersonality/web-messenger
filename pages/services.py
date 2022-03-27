from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException

from .models import Comment, File


class Http403(APIException):
    status_code = 403
    default_detail = 'You do not have access.'


def get_instance_and_check_access(request, model, pk, attr):
    instance = get_object_or_404(model, pk=pk)
    if getattr(instance, attr) != request.user.pk:
        raise Http403
    return instance


def set_comments_to_article(comment_serializer_class, articles):
    for article in articles:
        comments = Comment.objects.filter(article_id=article["id"]).select_related('user')
        serializer = comment_serializer_class(instance=comments, many=True)
        comments = serializer.data
        article["comments"] = comments


def upd_photo(request, user):
    for filename, file in request.FILES.items():
        try:
            with transaction.atomic():
                file = File(file=file)
                file.save()
                user.photo = file
                user.save()
        except Exception:
            transaction.rollback()
