from django.urls import path
from .views import (
    PropertyComments,
    UserComments,
    CreatePropertyComment,
    CreatePropertyReply,
    CreateUserComment,
    CreateUserReply, 
    UserNotifications, 
    ReadNotifications, 
    DeleteNotification,
    ClearNotifications,
    NoRepliesList
)

app_name='social'
urlpatterns = [
     path('comments/property/<int:pk>/', PropertyComments.as_view(), name="property_comments"),
     path('comments/user/<int:pk>/', UserComments.as_view(), name="user_comments"),
     path('comments/norep/<str:type>/<int:pk>/', NoRepliesList.as_view(), name="no_reps"),
     path('comments/property/write/<int:pk>/', CreatePropertyComment.as_view(), 
         name="create_property_comment"),
     path('comments/property/reply/<int:pk>/', CreatePropertyReply.as_view(), 
         name="create_property_reply"),
     path('comments/user/write/<int:pk>/', CreateUserComment.as_view(), 
         name="create_user_comment"),
     path('comments/user/reply/<int:pk>/', CreateUserReply.as_view(), 
         name="create_user_reply"),
     path('notifications/', UserNotifications.as_view(), name='notifications'),
     path('notifications/clear/', ClearNotifications.as_view({'delete': 'clear'}), name='clear_notifications'),
     path('notifications/<int:pk>/', ReadNotifications.as_view(), name='read_notification'),
     path('notifications/<int:pk>/delete/', DeleteNotification.as_view(), name='delete_notification'),
]
