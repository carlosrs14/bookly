from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from ..models import Author
from ..serializers import AuthorSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
    permission_classes = [IsAdminUser, IsAuthenticated]
    