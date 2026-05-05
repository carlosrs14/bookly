from rest_framework import serializers
from .userSerializer import UserSerializer
from .reviewSerializer import ReviewSerializer
from ..models.like import Like

class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    review =ReviewSerializer(read_only = True)

    class Meta:
        model = Like
        fields = '__all__'
        