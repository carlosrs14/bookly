from django.db import models
from django.contrib.auth.models import User

from .review import Review


class Comment(models.Model):
    """A comment on a review."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Review {self.review.id} comment by {self.user.username}"