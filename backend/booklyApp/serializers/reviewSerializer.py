from rest_framework import serializers
from .userSerializer import UserSerializer
from .bookSerializer import BookSerializer
from ..models.review import Review

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    book = BookSerializer(read_only = True)
    
    class Meta:
        model = Review
        fields = '__all__'