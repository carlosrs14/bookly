from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..serializers import FavoriteSerialzer
from ..models import Favorite, Review

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerialzer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user = self.request.user)
    
    def create(self, request, *args, **kwargs):
        review = get_object_or_404(Review, pk = request.data.get("review_id"))
        favorite, created = Favorite.objects.get_or_create(user = request.user, review = review)

        if not created:
            favorite.delete()
            return Response({"message": "Review deleted from favorites"}, status = status.HTTP_200_OK)
        return Response({"message": "Review added to favorites"}, status = status.HTTP_201_CREATED)
