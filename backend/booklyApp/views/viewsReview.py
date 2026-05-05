from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from ..serializers import ReviewSerializer
from ..models import Review

class ReviewFeed(generics.ListAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all().order_by("-created_at")

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(user = self.request.user)
    
    def perform_update(self, serializer:ReviewSerializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("Not permissions.")
        serializer.save()
    
    def perform_destroy(self, instance:Review):
        if instance.user != self.request.user:
            raise PermissionDenied("Not permissions.")
        instance.delete()
    
    def perform_create(self, serializer:ReviewSerializer):
        serializer.save(user = self.request.user)

