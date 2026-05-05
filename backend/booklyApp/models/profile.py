from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """Extended user profile with avatar support."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
