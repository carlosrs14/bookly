from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from ..serializers import GenderSerializer
from ..models import Gender

class GenderViewSet(viewsets.ModelViewSet):
    serializer_class = GenderSerializer
    queryset = Gender.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    