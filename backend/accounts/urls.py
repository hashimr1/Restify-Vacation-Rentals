from django.urls import path
from .views import Signup, EditProfile, ViewProfile, GetProfile

app_name='accounts'

urlpatterns = [
    path('signup/', Signup.as_view(), name='signup'),
    path('editprofile/', EditProfile.as_view(), name='edit_profile'),
    path('view/', ViewProfile.as_view(), name='view_profile'),
    path('get/<int:id>/', GetProfile.as_view(), name='get_profile'),
]
