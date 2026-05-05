from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data:dict):
        validated_data.pop('is_staff', None)
        validated_data.pop('is_superuser', None)
        return super().create(validated_data)
    
    def update(self, instance, validated_data:dict):
        validated_data.pop('is_staff', None)  # Evita cambios en `is_staff`
        validated_data.pop('is_superuser', None)  # Evita cambios en `is_superuser`
        return super().update(instance, validated_data)
    