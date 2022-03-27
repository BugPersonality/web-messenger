from django.db.models import Q

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


def get_instance_find_user(request):
    user = request.GET.get('text', '')
    if len(user.split()) > 1:
        return User.objects.filter((Q(name__icontains=user.split()[0]) & Q(surname__icontains='')) | (
                    Q(name__icontains=user.split()[1]) & Q(surname__icontains=user.split()[0]))).exclude(
            pk=request.user.pk)[:5]
    elif len(user.split()) == 1:
        return User.objects.filter(Q(name__icontains=user.split()[0]) | Q(surname__icontains=user.split()[0])).exclude(
            pk=request.user.pk)[:5]


def add_messages_and_owner(dialog, data, pk):
    msgs = data
    dialog['messages'] = msgs
    dialog['owner'] = pk
    return dialog


def get_msgs_of_dialog(pk):
    msgs = Message.objects.filter(dialog_id=pk).values()
    cache = {}
    for msg in msgs:
        user = msg['sender_id']
        if user in cache:
            file = cache[user]
        else:
            file = str(User.objects.get(pk=user).photo.file)
            cache[user] = file
        msg['photo'] = file
        msg['sender'] = msg['sender_id']
        msg['dialog'] = msg['dialog_id']
    return sorted(msgs, key=lambda msg: msg['id'], reverse=True)
