from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.services import auth
from .models import Message, Dialog
from .serializers import MessageSerializer, DialogSerializer
from authentication.models import User
from pages.services import get_instance_and_check_access
from .services import get_instance_and_check_dialog_access, get_instance_and_check_msg_access, save_dialog_and_add_user


class DialogAPIView(APIView):
    dialog_serializer_class = DialogSerializer
    message_serializer_class = MessageSerializer

    @auth
    def get(self, request, pk=None):
        if not pk:
            users = User.objects.prefetch_related('dialog').get(pk=request.user.pk)
            dialogs = [a for a in users.dialog.all()]
            serializer = self.dialog_serializer_class(instance=dialogs, many=True)
            dialogs = serializer.data
            return Response(dialogs, status=status.HTTP_200_OK)
        else:
            dialog = get_object_or_404(Dialog, pk=pk)
            serializer = self.dialog_serializer_class(instance=dialog)
            dialog = serializer.data
            msgs = Message.objects.filter(dialog_id=pk)
            serializer = self.message_serializer_class(instance=msgs, many=True)
            msgs = serializer.data
            dialog['messages'] = msgs
            return Response(dialog, status=status.HTTP_200_OK)

    @auth
    def post(self, request):
        data = request.data
        data['users'].append(request.user.pk)
        serializer = self.dialog_serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        if save_dialog_and_add_user(serializer, data):
            return Response({"id": serializer.data.get('id', None)},
                            status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "One of the Users does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

    @auth
    def put(self, request, pk):
        data = request.data
        dialog = get_instance_and_check_dialog_access(request, Dialog, pk)
        serializer = self.dialog_serializer_class(instance=dialog,
                                                  data=data,
                                                  partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @auth
    def delete(self, request, pk):
        dialog = get_instance_and_check_dialog_access(request, Dialog, pk)
        dialog.delete()
        return Response(status=status.HTTP_200_OK)


class MessageAPIView(APIView):
    serializer_class = MessageSerializer

    @auth
    def get(self, request, pk):
        msg = get_instance_and_check_msg_access(request, pk)
        serializer = self.serializer_class(instance=msg)
        msg = serializer.data
        return Response(msg, status=status.HTTP_200_OK)

    @auth
    def post(self, request, pk):
        data = request.data
        get_object_or_404(Dialog, pk=pk)
        data['dialog'] = pk
        data['sender'] = request.user.pk
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"id": serializer.data.get('id', None)},
                        status=status.HTTP_201_CREATED)

    @auth
    def put(self, request, pk):
        data = request.data
        msg = get_instance_and_check_access(request, Message, pk, 'sender_id')
        serializer = self.serializer_class(instance=msg,
                                           data=data,
                                           partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @auth
    def delete(self, request, pk):
        msg = get_instance_and_check_access(request, Message, pk, 'sender_id')
        msg.delete()
        return Response(status=status.HTTP_200_OK)
