from django.db import models


class DialogManager(models.Manager):

    def create_dialog(self, header, *args, **kwargs):
        dialog = self.model(header=header)
        dialog.save()
        return dialog


class Dialog(models.Model):
    header = models.CharField(max_length=255, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    objects = DialogManager()

    class Meta:
        db_table = 'dialog'


class MessageManager(models.Manager):
    def create_message(self, text, sender, dialog):
        message = self.model(text=text, sender=sender, dialog=dialog)
        message.save()
        return message


class Message(models.Model):
    sender = models.ForeignKey(to='authentication.User', verbose_name='Пользователь',
                               on_delete=models.CASCADE, related_name='send')
    dialog = models.ForeignKey(to='msgs.Dialog', verbose_name='Диалог',
                               on_delete=models.CASCADE, related_name='dia')
    text = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    objects = MessageManager()

    class Meta:
        db_table = 'message'
