from rest_framework import status, views, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

from ..serializers import UserSerializer, ProfileSerializer


class RegisterView(views.APIView):
    """Create a new user account and return JWT tokens."""

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Generate tokens for the new user
        token_data = {
            "username": request.data["username"],
            "password": request.data["password"],
        }
        token_serializer = TokenObtainPairSerializer(data=token_data)
        token_serializer.is_valid(raise_exception=True)

        return Response(token_serializer.validated_data, status=status.HTTP_201_CREATED)


class MeView(generics.RetrieveAPIView):
    """Get the currently authenticated user's info."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileUpdateView(views.APIView):
    """Update the current user's profile (avatar, bio)."""

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user, context={"request": request}).data)
