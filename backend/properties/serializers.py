from rest_framework.serializers import ModelSerializer, FileField, RelatedField
from .models import Property, PropertyRanges


class PropertyRangesSerializer(ModelSerializer):
    class Meta:
        model = PropertyRanges
        fields = ["property", "price", "start_date", "end_date"]

class ListPropertyRangesSerializer(ModelSerializer):
    class Meta:
        model = PropertyRanges
        fields = ["pk", "property", "price", "start_date", "end_date"]

class PropertySerializer(ModelSerializer):
    preview = FileField(required=False)
    propertyranges = PropertyRangesSerializer(many=True, read_only=True)
    class Meta:
        model = Property
        fields = ["host", "pk", "name", "description", "address", "property_type", "stay_type", "beds", "baths", "guests", "preview", "preview2", "preview3", "tv", "air_condition", "wifi", "kitchen",
                  "hair_dryer", "heating", "iron", "washer", "dryer", "pool", "free_parking",
                  "crib", "grill", "hot_tub", "EV_charger", "gym", "indoor_fireplace", "breakfast", "smoking_allowed", "propertyranges"]

        
