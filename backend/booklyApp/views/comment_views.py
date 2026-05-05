from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from ..models import Comment
from ..serializers import CommentSerializer


class CommentListCreateView(generics.ListCreateAPIView):
    """List and create comments for a specific review."""

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(
            review_id=self.kwargs["review_id"]
        ).select_related("user", "user__profile")

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            review_id=self.kwargs["review_id"],
        )
