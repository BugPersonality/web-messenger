# Generated by Django 4.0.2 on 2022-03-05 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_user_dialog'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='photo',
            field=models.TextField(null=True),
        ),
    ]