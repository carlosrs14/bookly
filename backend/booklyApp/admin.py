from django.contrib import admin
from . import models

admin.site.register(models.Book)
admin.site.register(models.Genre)
admin.site.register(models.Author)
admin.site.register(models.Review)
admin.site.register(models.Comment)
admin.site.register(models.Like)
admin.site.register(models.Favorite)
admin.site.register(models.Profile)

admin.site.site_header = "Bookly Admin"
admin.site.site_title = "Bookly"