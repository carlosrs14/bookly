# 📚 Bookly

Social book review platform — discover books, write reviews, interact with readers.

**Stack:** Django REST Framework · Angular 19 · PostgreSQL · Nginx · Docker

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Test users: `alice`, `bob`, `carlos` — password: `password123`

## API

Base: `/api/v1/`

| Endpoint | Description |
|---|---|
| `POST /auth/register/` | Create account |
| `POST /auth/login/` | Get JWT tokens |
| `POST /auth/refresh/` | Refresh token |
| `GET /auth/me/` | Current user |
| `PATCH /auth/profile/` | Update avatar/bio |
| `GET /feed/` | Review feed (cursor paginated) |
| `GET /books/` | Book catalog (search, filter) |
| `GET /books/:id/` | Book detail |
| `POST /reviews/` | Create review |
| `POST /reviews/:id/like/` | Toggle like |
| `POST /reviews/:id/favorite/` | Toggle favorite |
| `GET /reviews/:id/comments/` | List comments |
| `POST /reviews/:id/comments/` | Add comment |
| `GET /me/favorites/` | My favorites |
| `GET /genres/` | List genres |
| `GET /authors/` | List authors |

## Dev (without Docker)

```bash
# Backend
cd backend && pip install -r requirements.txt
python manage.py migrate && python manage.py seed && python manage.py runserver

# Frontend
cd frontend && npm install && ng serve
```
