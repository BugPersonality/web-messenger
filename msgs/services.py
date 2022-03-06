from authentication.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.shortcuts import get_object_or_404

from msgs.models import Message, Dialog
from pages.services import Http403


def save_dialog_and_add_user(serializer, data):
    try:
        with transaction.atomic():
            dialog = serializer.save()
            for user in data['users']:
                user = User.objects.get(pk=user)
                user.dialog.add(dialog)
    except ObjectDoesNotExist:
        transaction.rollback()
        return False
    else:
        return True


def get_instance_and_check_dialog_access(request, model, pk):
    instance = get_object_or_404(model, pk=pk)
    if instance not in model.objects.filter(user__id=request.user.pk):
        raise Http403
    return instance


def get_instance_and_check_msg_access(request, pk):
    msg = get_object_or_404(Message, pk=pk)
    if msg.dialog_id not in Dialog.objects.filter(user__id=request.user.pk):
        raise Http403
    return msg
