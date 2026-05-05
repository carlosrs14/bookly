import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review, LikeResponse, FavoriteResponse } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  create(bookId: number, content: string, rating?: number): Observable<Review> {
    return this.http.post<Review>(`${this.api}reviews/`, {
      book_id: bookId,
      content,
      rating,
    });
  }

  update(id: number, content: string, rating?: number): Observable<Review> {
    return this.http.patch<Review>(`${this.api}reviews/${id}/`, { content, rating });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}reviews/${id}/`);
  }

  toggleLike(reviewId: number): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(`${this.api}reviews/${reviewId}/like/`, {});
  }

  toggleFavorite(reviewId: number): Observable<FavoriteResponse> {
    return this.http.post<FavoriteResponse>(`${this.api}reviews/${reviewId}/favorite/`, {});
  }
}
