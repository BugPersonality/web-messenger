# Generated by Django 4.0.2 on 2022-02-27 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_user_table'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='surname',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
