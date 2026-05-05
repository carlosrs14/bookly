from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Exists, OuterRef

from ..models import Favorite, Like
from ..serializers import FavoriteSerializer


class FavoriteListView(generics.ListAPIView):
    """List the authenticated user's favorite reviews."""

    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Favorite.objects.filter(user=user).select_related(
            "review", "review__user", "review__user__profile",
            "review__book", "review__book__author",
        ).order_by("-created_at")
