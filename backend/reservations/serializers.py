from rest_framework.serializers import ModelSerializer, ReadOnlyField, ValidationError
from .models import Reservation

class ReservationSerializer(ModelSerializer):
    def validate(self, attrs):
        validated_data = super().validate(attrs)
        if validated_data.get('start_date') > validated_data.get('end_date'):
            raise ValidationError({'start_date': 'Start date for reservation must be before end date'})
        return validated_data
    
    class Meta:
        model = Reservation
        fields = ['start_date', 'end_date', 'pk', 'guest', 'host', 'property', 'status']
        read_only_fields = ['pk', 'guest', 'host', 'property', 'status']
        