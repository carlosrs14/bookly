from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.Book)
admin.site.register(models.Gender)
admin.site.register(models.Author)
admin.site.register(models.Review)
admin.site.register(models.Comment)
admin.site.register(models.Like)
admin.site.register(models.Favorite)