# Generated by Django 4.0.2 on 2022-02-28 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_user_name_user_surname'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='age',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='photo',
            field=models.IntegerField(null=True),
        ),
    ]