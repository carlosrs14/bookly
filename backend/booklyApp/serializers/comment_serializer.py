from rest_framework import serializers

from .user_serializer import UserMinimalSerializer
from ..models import Comment


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for review comments."""

    user = UserMinimalSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "review", "content", "created_at", "updated_at"]
        read_only_fields = ["review", "created_at", "updated_at"]
