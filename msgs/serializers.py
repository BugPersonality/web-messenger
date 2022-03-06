from rest_framework import serializers

from .models import Message, Dialog


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'text', 'sender', 'dialog')

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
        fields = ('id', 'header')

    def create(self, validated_data):
        return Dialog.objects.create_dialog(**validated_data)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
