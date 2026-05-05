from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count, Exists, OuterRef

from ..serializers import ReviewSerializer
from ..models import Review, Like, Favorite


class FeedView(generics.ListAPIView):
    """Public review feed with pagination (supports infinite scroll).

    Annotates each review with likes_count, comments_count, and
    per-user is_liked/is_favorited flags when authenticated.
    """

    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Review.objects.select_related(
            "user", "user__profile", "book", "book__author"
        ).annotate(
            likes_count=Count("likes"),
            comments_count=Count("comments"),
        ).order_by("-created_at")

        # Add per-user flags if authenticated
        user = self.request.user
        if user.is_authenticated:
            queryset = queryset.annotate(
                is_liked=Exists(Like.objects.filter(review=OuterRef("pk"), user=user)),
                is_favorited=Exists(Favorite.objects.filter(review=OuterRef("pk"), user=user)),
            )

        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    """CRUD for the authenticated user's own reviews."""

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).annotate(
            likes_count=Count("likes"),
            comments_count=Count("comments"),
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("You can only edit your own reviews.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own reviews.")
        instance.delete()
