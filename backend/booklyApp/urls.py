from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from booklyApp import views

router = DefaultRouter()
router.register(r"books", views.BookViewSet, basename="books")
router.register(r"genres", views.GenreViewSet, basename="genres")
router.register(r"authors", views.AuthorViewSet, basename="authors")
router.register(r"reviews", views.ReviewViewSet, basename="reviews")

urlpatterns = [
    # Router-generated endpoints
    path("", include(router.urls)),

    # Auth
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("auth/me/", views.MeView.as_view(), name="me"),
    path("auth/profile/", views.ProfileUpdateView.as_view(), name="profile-update"),

    # Feed (public, paginated)
    path("feed/", views.FeedView.as_view(), name="feed"),

    # Review interactions
    path("reviews/<int:review_id>/like/", views.toggle_like, name="toggle-like"),
    path("reviews/<int:review_id>/favorite/", views.toggle_favorite, name="toggle-favorite"),
    path("reviews/<int:review_id>/comments/", views.CommentListCreateView.as_view(), name="review-comments"),

    # User's favorites
    path("me/favorites/", views.FavoriteListView.as_view(), name="my-favorites"),
]