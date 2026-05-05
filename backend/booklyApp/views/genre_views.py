from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

from ..serializers import GenreSerializer
from ..models import Genre


class GenreViewSet(viewsets.ModelViewSet):
    """Genre CRUD. Anyone can list/retrieve; only admins can create/update/delete."""

    serializer_class = GenreSerializer
    queryset = Genre.objects.all()

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]
