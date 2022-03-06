from django.shortcuts import get_object_or_404
from rest_framework.exceptions import APIException

from pages.models import Comment


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
        comments = Comment.objects.filter(article_id=article["id"])
        serializer = comment_serializer_class(instance=comments, many=True)
        comments = serializer.data
        article["comments"] = comments
