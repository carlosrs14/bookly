from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from ..models import Book
from ..serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    """Book CRUD. Anyone can list/retrieve; only admins can create/update/delete."""

    serializer_class = BookSerializer
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "author__name", "genres__name"]
    ordering_fields = ["title", "published_year", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = Book.objects.select_related("author").prefetch_related("genres")

        # Filter by genre
        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genres__id=genre)

        # Filter by author
        author = self.request.query_params.get("author")
        if author:
            queryset = queryset.filter(author__id=author)

        return queryset.distinct()

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]
