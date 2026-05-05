from django.db import models

from .author import Author
from .genre import Genre


class Book(models.Model):
    """A book entry with metadata, genre classification, and optional cover image."""

    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    genres = models.ManyToManyField(Genre, related_name="books", blank=True)
    published_year = models.IntegerField(null=True, blank=True)
    synopsis = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="covers/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title