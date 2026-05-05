from rest_framework import serializers

from .review_serializer import ReviewSerializer
from ..models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer for user's favorite reviews."""

    review = ReviewSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "review", "created_at"]
        read_only_fields = ["created_at"]
