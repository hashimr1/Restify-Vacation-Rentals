from django.urls import path
from .views import CreateProperty, SearchProperty, DeleteProperty, UpdateProperty, AddAvailability, MyListings, ShowAvailability, DeletePropertyRange

app_name='properties'
urlpatterns = [
    path('createproperty/', CreateProperty.as_view(), name='create_property'),
    path('<int:pk>/addavailability/', AddAvailability.as_view(), name='add_availability'),
    path('<int:pk>/updateproperty/', UpdateProperty.as_view(), name='update_property'),
    path('searchproperty/', SearchProperty.as_view(), name='search_property'),
    path('<int:pk>/deleteproperty/', DeleteProperty.as_view(), name='delete_property'),
    path('listings/', MyListings.as_view(), name='my_listings'),
    path('<int:pk>/showavailability/', ShowAvailability.as_view(), name="show_availability"),
    path('<int:pk>/deleteavailability/', DeletePropertyRange.as_view(), name="delete_availability"),
]