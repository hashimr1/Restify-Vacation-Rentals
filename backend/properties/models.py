from django.db import models
from accounts.models import User
from datetime import date
from django.core.validators import MaxValueValidator
# Create your models here.

PROPERTY_TYPES = (
    ("Apartment", "Apartment"),
    ("House", "House"),
    ("Secondary unit", "Secondary unit"),
    ("Unique space", "Unique space"),
    ("Bed and breakfast", "Bed and breakfast"),
    ("Boutique hotel", "Boutique hotel")
    )

STAY_TYPE = (
    ('Private room','Private room'),
    ('Shared property','Shared property'),
    ('Whole place', 'Whole place')
)

AMENITIES = (
    ("tv", "tv"),
    ("air_condition", "air_condition"),
    ("wifi", "wifi"),
    ("kitchen", "kitchen"),
    ("hair_dryer", "hair_dryer"),
    ("heating", "heating"),
    ("iron", "iron"),
    ("workspace", "workspace"),
    ("washer", "washer"),
    ("dryer", "dryer"),
    ("pool", "pool"),
    ("free_parking", "free_parking"),
    ("crib", "crib"),
    ("grill", "grill"),
    ("hot_tub", "hot_tub"),
    ("EV_charger", "EV_charger"),
    ("gym", "gym"),
    ("indoor_fireplace", "indoor_fireplace"),
    ("breakfast", "breakfast"),
    ("smoking_allowed", "smoking_allowed")
)

ORDERS = (
    ("None", "None"),
    ("Name", "Name"),
    ("Price", "Price"),
    ("Both", "Both")
)

class Property(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=500)
    address = models.CharField(max_length=250)
    property_type = models.CharField(choices=PROPERTY_TYPES, default='1', max_length=30)
    stay_type = models.CharField(choices=STAY_TYPE, default='1', max_length=30)
    beds = models.IntegerField(default=1)
    baths = models.IntegerField(default=1)
    guests = models.IntegerField(default=1)
    preview = models.ImageField()
    preview2 = models.ImageField(null=True, default="house.jpg")
    preview3 = models.ImageField(null=True, default="house.jpg")

    tv = models.BooleanField(default=False)  
    air_condition = models.BooleanField(default=False)  
    wifi = models.BooleanField(default=False)  
    kitchen = models.BooleanField(default=False)  
    hair_dryer = models.BooleanField(default=False)  
    heating = models.BooleanField(default=False)  
    iron = models.BooleanField(default=False)  
    workspace = models.BooleanField(default=False)  
    washer = models.BooleanField(default=False)  
    dryer = models.BooleanField(default=False)  
    pool = models.BooleanField(default=False)  
    free_parking = models.BooleanField(default=False)  
    crib = models.BooleanField(default=False)  
    grill = models.BooleanField(default=False)  
    hot_tub = models.BooleanField(default=False)  
    EV_charger = models.BooleanField(default=False)  
    gym = models.BooleanField(default=False)  
    indoor_fireplace = models.BooleanField(default=False)  
    breakfast = models.BooleanField(default=False)  
    smoking_allowed = models.BooleanField(default=False) 


class PropertyRanges(models.Model):
    property = models.ForeignKey(Property, related_name="propertyranges", on_delete=models.CASCADE)

    price = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField()



