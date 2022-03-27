# Generated by Django 4.0.2 on 2022-03-07 10:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authentication', '0001_initial'),
        ('msgs', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='dialog',
            field=models.ManyToManyField(to='msgs.Dialog'),
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='user',
            name='photo',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='pages.file', verbose_name='Файл'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]