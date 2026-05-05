from django.db import models
from django.contrib.auth.models import User
from .review import Review

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'review')
        
    def __str__(self):
        return f"{self.review.id} favorite for {self.user.username}"
    