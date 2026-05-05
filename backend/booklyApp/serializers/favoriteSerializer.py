from rest_framework import serializers
from .reviewSerializer import ReviewSerializer
from .userSerializer import UserSerializer
from ..models.favorite import Favorite

class FavoriteSerialzer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    review = ReviewSerializer(read_only = True)
    
    class Meta:
        model = Favorite
        fields = '__all__'
    