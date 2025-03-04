from django.db import models
from .author import Author
from .gender import Gender

class Book(models.Model):
    title = models.TextField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    genre = models.ForeignKey(Gender, on_delete=models.CASCADE, related_name='books')
    published_year = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title
    