from rest_framework.pagination import CursorPagination, PageNumberPagination


class FeedCursorPagination(CursorPagination):
    """Cursor-based pagination for the review feed (infinite scroll)."""

    page_size = 10
    ordering = "-created_at"
    cursor_query_param = "cursor"


class StandardPagination(PageNumberPagination):
    """Standard page-number pagination for lists."""

    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50
