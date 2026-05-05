from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Comment
from ..serializers import CommentSerializer

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        review = self.request.query_params.get("review_id")
        if review:
            return Comment.objects.filter(review_id = review)
        return Response({"message": "Not allowed"}, status = status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer:CommentSerializer):
        serializer.save(user = self.request.user)    
