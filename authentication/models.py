from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from msgs.models import Dialog


class UserManager(BaseUserManager):

    def create_user(self, email, password, username):
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.username = username
        user.save()

        return user

    def create_superuser(self, email, password, username):
        user = self.create_user(email, password, username)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    dialog = models.ManyToManyField(Dialog)
    username = models.CharField(db_index=True, max_length=255, unique=True, null=True)
    email = models.EmailField(db_index=True, unique=True, null=True)
    name = models.CharField(max_length=255, null=True)
    surname = models.CharField(max_length=255, null=True)
    age = models.IntegerField(null=True)
    photo = models.ForeignKey(to='pages.File', verbose_name='Файл',
                              on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'user'
