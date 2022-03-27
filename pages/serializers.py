from rest_framework import serializers

from .models import Article, Comment


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ('id', 'header', 'text', 'user')

    def create(self, validated_data):
        return Article.objects.create_article(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class CommentSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'text', 'article', 'user', 'photo', 'name')

    def get_photo(self, comment):
        return 'media/' + str(comment.user.photo.file)

    def get_name(self, comment):
        return comment.user.name

    def create(self, validated_data):
        return Comment.objects.create_article(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
