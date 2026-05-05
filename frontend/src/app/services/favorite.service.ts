import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Favorite, PaginatedResponse } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getFavorites(cursorUrl?: string): Observable<PaginatedResponse<Favorite>> {
    const url = cursorUrl || `${this.api}me/favorites/`;
    return this.http.get<PaginatedResponse<Favorite>>(url);
  }
}
