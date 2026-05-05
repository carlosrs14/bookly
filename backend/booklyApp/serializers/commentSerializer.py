from rest_framework import serializers
from .userSerializer import UserSerializer
from .reviewSerializer import ReviewSerializer
from ..models.comment import Comment

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    review = ReviewSerializer(read_only = True)

    class Meta:
        model = Comment
        fields = '__all__'
