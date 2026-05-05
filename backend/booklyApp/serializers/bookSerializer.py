from rest_framework import serializers
from .authorSerializer import AuthorSerializer
from .genderSerializer import GenderSerializer
from ..models import Book

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True) 
    geners = GenderSerializer(many = True, read_only = True)
    
    class Meta:
        model = Book
        fields = '__all__'