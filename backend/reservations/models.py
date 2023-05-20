from django.db import models
from accounts.models import User
from properties.models import Property

STATES = (
    ("Pending", "Pending"),
    ("Denied", "Denied"),
    ("Expired", "Expired"),
    ("Approved", "Approved"),
    ("Canceled", "Canceled"),
    ("Terminated","Terminated"),
    ("Completed", "Completed"),
    ("Cancellation_Request", "Cancellation_Request")
)

class Reservation(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    guest = models.ForeignKey(User, on_delete=models.CASCADE, 
                              related_name='guest_reservations')
    host = models.ForeignKey(User, on_delete=models.CASCADE, 
                             related_name='host_reservations')
    status = models.CharField(choices=STATES, max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()