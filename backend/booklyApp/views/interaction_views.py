from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from ..models import Like, Favorite, Review


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_like(request, review_id):
    """Toggle a like on a review. Returns the new state and total count."""
    review = get_object_or_404(Review, pk=review_id)
    like, created = Like.objects.get_or_create(user=request.user, review=review)

    if not created:
        like.delete()
        liked = False
    else:
        liked = True

    likes_count = review.likes.count()
    return Response(
        {"liked": liked, "likes_count": likes_count},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, review_id):
    """Toggle a favorite on a review. Returns the new state."""
    review = get_object_or_404(Review, pk=review_id)
    favorite, created = Favorite.objects.get_or_create(user=request.user, review=review)

    if not created:
        favorite.delete()
        favorited = False
    else:
        favorited = True

    return Response(
        {"favorited": favorited},
        status=status.HTTP_200_OK,
    )
