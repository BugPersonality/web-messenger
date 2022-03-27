from rest_framework import serializers

from authentication.models import User
from .models import Message, Dialog


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'text', 'sender', 'dialog', 'creation_date')

    def create(self, validated_data):
        return Message.objects.create_message(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class DialogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dialog
        fields = ('id', 'header', 'update_date')

    def create(self, validated_data):
        return Dialog.objects.create_dialog(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class FindUserSerializer(serializers.ModelSerializer):
    name_surname = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('name', 'surname', 'id', 'name_surname', 'photo')

    def get_name_surname(self, obj):
        return (str(obj.name) if obj.name else '') + ' ' + (str(obj.surname) if obj.surname else '')

    def get_photo(self, user):
        return 'media/' + str(user.photo.file)
