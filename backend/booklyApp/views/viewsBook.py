from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from ..models import Book
from ..serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()
    permission_classes = [IsAdminUser, IsAuthenticated]