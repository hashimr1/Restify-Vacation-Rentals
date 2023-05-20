from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    # the User model inherits username, first_name, last_name, email, password from AbstractUser
    # confirm_password = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=10, blank=True)
    photo = models.ImageField(default="empty-profile.png", blank=True, null=True)
