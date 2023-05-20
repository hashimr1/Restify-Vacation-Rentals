from django.urls import path
from .views import (
    GuestReservations, 
    HostReservations, 
    CreateReservation, 
    CancelReservation,
    ApproveReservation,
    DenyReservation,
    TerminateReservation
)
app_name='reservations'
urlpatterns = [
    path('guest/reservations/', GuestReservations.as_view(), name='guest_reservations'),
    path('host/reservations/', HostReservations.as_view(), name='host_reservations'),
    path('<int:pk>/reserve/', CreateReservation.as_view(), name='create_reservation'),
    path('<int:pk>/cancel/', CancelReservation.as_view(), name='cancel_reservation'),
    path('<int:pk>/approve/', ApproveReservation.as_view(), name='approve_reservation'),
    path('<int:pk>/deny/', DenyReservation.as_view(), name='deny_reservation'),
    path('<int:pk>/terminate/', TerminateReservation.as_view(), name='terminate_reservation'),
]