from django.db import models


class Genre(models.Model):
    """Literary genre classification for books."""

    name = models.CharField(max_length=100)
    description = models.CharField(max_length=250, blank=True)

    def __str__(self):
        return self.name
