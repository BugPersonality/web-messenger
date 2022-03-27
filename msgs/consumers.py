import json

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message

class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['dialog_id']
        self.room_group_name = f'dialog_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data.get('message')
        action = data.get('action')
        photo = data.get('photo')
        sender = data.get('sender')
        pk = data.get('id')
        creation_date = data.get('creation_date')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': action,
                'message': message,
                'photo': photo,
                'sender': sender,
                'id': pk,
                'creation_date': creation_date
            }
        )

    async def change_message(self, event):
        pk = event['id']
        message = event['message']

        await self.send(text_data=json.dumps(
            {
                'type': 'change_message',
                'id': pk,
                'message': message
            })
        )

    async def del_message(self, event):
        pk = event['id']

        await self.send(text_data=json.dumps(
            {
                'type': 'del_message',
                'id': pk
            })
        )

    async def chat_message(self, event):
        message = event['message']
        photo = event['photo']
        sender = event['sender']
        pk = event['id']
        creation_date = event['creation_date']

        await self.send(text_data=json.dumps(
            {
                'type': 'chat_message',
                'message': message,
                'photo': photo,
                'sender': sender,
                'id': pk,
                'creation_date': creation_date
            })
        )

    async def disconnect(self, message):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
