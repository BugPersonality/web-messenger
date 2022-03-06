# Generated by Django 4.0.2 on 2022-02-28 18:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('msgs', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Dialog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=255)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('dialog', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dia', to='msgs.dialog', verbose_name='Диалог')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='send', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'db_table': 'dialog',
            },
        ),
        migrations.RemoveField(
            model_name='message',
            name='receiver',
        ),
        migrations.AddField(
            model_name='message',
            name='dialog',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='dialog', to=settings.AUTH_USER_MODEL, verbose_name='Диалог'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='UserDialog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dialog', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='msgs.dialog', verbose_name='Диалог')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'db_table': 'user_dialog',
            },
        ),
    ]
