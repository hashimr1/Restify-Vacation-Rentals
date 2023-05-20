from django.db import models
from accounts.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from reservations.models import Reservation
from django.utils import timezone
 
# Create your models here.

class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    
    # Sender of the message, will always be a Host or a Guest but both are Users
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=500)

    # The message being replied to, if it is a reply.
    reply_to = models.ForeignKey('self', on_delete=models.CASCADE, null=True,
                                 blank=True)
    
    # The reservation pertaining to these comments. A particular stay.
    # Each reservation can have 2 comments from the guest and 2 from the host
    # 2 from host: 
    #   1 comment on the user profile (subject is user, reply_to is null), 
    #   1 reply to the user's comment on the property (subject is property, 
    #   reply_to is the user's initial comment)
    # 2 from guest:
    #   1 comment on the property (subject is property, reply_to is null)
    #   1 reply to the host (subject is still property but reply_to is the
    #   message of the host)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=500)
    read = models.BooleanField(default=False)
    