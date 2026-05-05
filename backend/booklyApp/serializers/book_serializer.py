from rest_framework import serializers

from .author_serializer import AuthorSerializer
from .genre_serializer import GenreSerializer
from ..models import Book, Author, Genre


class BookSerializer(serializers.ModelSerializer):
    """Serializer for book listing and detail views."""

    author = AuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        source="author",
        queryset=Author.objects.all(),
        write_only=True,
    )
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        source="genres",
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )
    reviews_count = serializers.IntegerField(source="reviews.count", read_only=True)

    class Meta:
        model = Book
        fields = [
            "id", "title", "author", "author_id", "genres", "genre_ids",
            "published_year", "synopsis", "cover_image", "reviews_count",
            "created_at",
        ]
