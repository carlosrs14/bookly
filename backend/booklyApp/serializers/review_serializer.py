from rest_framework import serializers

from .user_serializer import UserMinimalSerializer
from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for reviews with computed interaction counts."""

    user = UserMinimalSerializer(read_only=True)
    book_id = serializers.IntegerField(write_only=True)
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_author = serializers.CharField(source="book.author.name", read_only=True)
    book_cover = serializers.ImageField(source="book.cover_image", read_only=True)
    likes_count = serializers.IntegerField(read_only=True, default=0)
    comments_count = serializers.IntegerField(read_only=True, default=0)
    is_liked = serializers.BooleanField(read_only=True, default=False)
    is_favorited = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = Review
        fields = [
            "id", "user", "book_id", "book_title", "book_author", "book_cover",
            "content", "rating", "likes_count", "comments_count",
            "is_liked", "is_favorited", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
