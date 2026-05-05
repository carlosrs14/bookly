import { User } from './user.model';

export interface Review {
  id: number;
  user: User;
  book_id: number;
  book_title: string;
  book_author: string;
  book_cover: string | null;
  content: string;
  rating: number | null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  user: User;
  review: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count?: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LikeResponse {
  liked: boolean;
  likes_count: number;
}

export interface FavoriteResponse {
  favorited: boolean;
}

export interface Favorite {
  id: number;
  review: Review;
  created_at: string;
}
