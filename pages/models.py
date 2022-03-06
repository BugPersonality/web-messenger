from uuid import uuid4

from django.db import models


class CommentManager(models.Manager):

    def create_article(self, text, article, user):
        comment = self.model(text=text, article=article, user=user)
        comment.save()
        return comment


class Comment(models.Model):
    article = models.ForeignKey(to='pages.Article', verbose_name='Запись',
                                on_delete=models.CASCADE)
    user = models.ForeignKey(to='authentication.User', verbose_name='Пользователь',
                             on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    objects = CommentManager()

    class Meta:
        db_table = 'comment'


class ArticleManager(models.Manager):

    def create_article(self, header, text, user):
        article = self.model(header=header, text=text, user=user)
        article.save()
        return article


class Article(models.Model):
    user = models.ForeignKey(to='authentication.User', verbose_name='Пользователь',
                             on_delete=models.CASCADE)
    header = models.CharField(max_length=255)
    text = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    objects = ArticleManager()

    class Meta:
        db_table = 'article'


def upload_path_handler(instance, filename):
    return "users/{id}/{file}.{ext}".format(id=instance.user, file=uuid4(), ext=filename.split('.')[-1])


class File(models.Model):
    user = models.ForeignKey(to='authentication.User', verbose_name='Пользователь',
                             on_delete=models.CASCADE)
    file = models.FileField(upload_to=upload_path_handler)
