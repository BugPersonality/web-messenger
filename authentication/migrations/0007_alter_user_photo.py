# Generated by Django 4.0.2 on 2022-03-05 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0006_alter_user_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.TextField(default='https://i.imgur.com/rbFwK50.jpg', null=True),
        ),
    ]