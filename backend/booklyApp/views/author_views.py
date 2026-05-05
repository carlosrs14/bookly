from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from ..models import Author
from ..serializers import AuthorSerializer


class AuthorViewSet(viewsets.ModelViewSet):
    """Author CRUD. Anyone can list/retrieve; only admins can create/update/delete."""

    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]
