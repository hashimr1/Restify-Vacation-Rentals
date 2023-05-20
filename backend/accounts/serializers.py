from rest_framework.serializers import ModelSerializer, ValidationError, CharField
from .models import User
import re

class UserSerializer(ModelSerializer):
    confirm_password = CharField(max_length=128, write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 
                  'confirm_password', 'phone_number', 'photo']

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = super().create(validated_data)  
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data and 'confirm_password' in validated_data:
            instance.set_password(validated_data['password'])
        
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.photo = validated_data.get('photo', instance.photo)
        instance.save()
        return instance   

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        password = validated_data.get('password')
        confirm_password = validated_data.get('confirm_password')

        if re.search('[A-Z]', password) == None and re.search('[0-9]', password) == None and re.search('[^A-Za-z0-9]', password) == None:
            raise ValidationError({'password': 'Password is not strong, it must contian a minimum of one uppercase, one digit and one symbol'})

        if confirm_password != password:
            raise ValidationError({'confirm_password': 'Confirm password must match password'})
        
        return validated_data

class ViewUserSerializer(ModelSerializer):
    
    class Meta:
        model = User
        fields = ['pk','username', 'first_name', 'last_name', 'email', 'phone_number', 'photo']
