from django.db import models


class Author(models.Model):
    name = models.CharField(max_length=45, null=False)
    birth_date = models.CharField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name