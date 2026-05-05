import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getComments(reviewId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.api}reviews/${reviewId}/comments/`);
  }

  create(reviewId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.api}reviews/${reviewId}/comments/`, { content });
  }
}
