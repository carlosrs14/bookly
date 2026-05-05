from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from ..models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "bio"]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user registration and display."""

    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True, "min_length": 6}}

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        user = super().create(validated_data)
        Profile.objects.create(user=user)
        return user


class UserMinimalSerializer(serializers.ModelSerializer):
    """Lightweight user info for embedding in reviews/comments."""

    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "avatar"]

    def get_avatar(self, obj):
        if hasattr(obj, "profile") and obj.profile.avatar:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile.avatar.url)
            return obj.profile.avatar.url
        return None
