import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book, Genre } from '../models/book.model';
import { PaginatedResponse } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getBooks(params?: { search?: string; genre?: number; page?: number }): Observable<PaginatedResponse<Book>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.genre) httpParams = httpParams.set('genre', params.genre.toString());
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());

    return this.http.get<PaginatedResponse<Book>>(`${this.api}books/`, { params: httpParams });
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.api}books/${id}/`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.api}genres/`);
  }
}
