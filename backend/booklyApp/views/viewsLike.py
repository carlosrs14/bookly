from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..serializers import LikeSerializer
from ..models import Like, Review

class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(user = self.request.user)
    
    def create(self, request, *args, **kwargs):
        review = get_object_or_404(Review, pk=request.data.get("review_id"))
        like, created = Like.objects.get_or_create(user = request.user, review = review)

        if not created:
            like.delete()
            return Response({"message": "Like deleted"}, status = status.HTTP_200_OK)
        return Response({"message": "Like added"}, status =  status.HTTP_201_CREATED)
    