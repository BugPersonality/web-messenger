import json

from channels.generic.websocket import AsyncWebsocketConsumer


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
        message = data['message']
        photo = data['photo']
        sender = data['sender']
        pk = data['id']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'photo': photo,
                'sender': sender,
                'id': pk
            }
        )

    async def chat_message(self, event):
        message = event['message']
        photo = event['photo']
        sender = event['sender']
        pk = event['id']

        await self.send(text_data=json.dumps(
            {
                'type': 'chat_message',
                'message': message,
                'photo': photo,
                'sender': sender,
                'id': pk
            })
        )

    async def disconnect(self, message):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
