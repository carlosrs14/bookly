import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review, PaginatedResponse } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  /** Fetch the review feed. Pass a full cursor URL for infinite scroll. */
  getFeed(cursorUrl?: string): Observable<PaginatedResponse<Review>> {
    const url = cursorUrl || `${this.api}feed/`;
    return this.http.get<PaginatedResponse<Review>>(url);
  }
}
