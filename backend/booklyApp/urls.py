from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from backend.booklyApp import views

router = DefaultRouter()

# to admin
router.register(r'gender', views.GenderViewSet, basename = 'gender')
router.register(r'books', views.BookViewSet, basename = 'books')
router.register(r'authors', views.AuthorViewSet, basename = 'authors')

# to users
router.register(r'reviews', views.ReviewViewSet, basename = 'reviews')
router.register(r'likes', views.LikeViewSet, basename = 'likes')
router.register(r'favorites', views.FavoriteViewSet, basename = 'favorites')
router.register(r'comments', views.CommentViewSet, basename = 'comments')

urlpatterns = [
    path('', include(router.urls)),
    path('reviews-feed/', views.ReviewFeed.as_view(), name = 'reviews-feed'),
    path('login/', TokenObtainPairView.as_view(), name = 'login'),
    path('refresh/', TokenRefreshView.as_view(), name = 'refresh'),
    path('user/', views.UserCreateView.as_view(), name = 'register'),
    path('user/<int:pk>/', views.UserDetailView.as_view(), name = 'user-info')

]