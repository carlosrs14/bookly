from django.db import models
from django.contrib.auth.models import User
from .review import Review

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='likes')
    create_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'review')
    
    def __str__(self):
        return f"review {self.review.id} liked by {self.user.username}"
    