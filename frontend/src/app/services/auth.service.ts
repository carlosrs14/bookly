import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, AuthTokens, RegisterPayload } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl;

  /** Reactive state */
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    // Restore session on app start
    if (this.getAccessToken()) {
      this.fetchMe();
    }
  }

  login(username: string, password: string) {
    return this.http.post<AuthTokens>(`${this.api}auth/login/`, { username, password }).pipe(
      tap(tokens => {
        this.storeTokens(tokens);
        this.fetchMe();
      })
    );
  }

  register(payload: RegisterPayload) {
    return this.http.post<AuthTokens>(`${this.api}auth/register/`, payload).pipe(
      tap(tokens => {
        this.storeTokens(tokens);
        this.fetchMe();
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  refreshToken() {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return;

    return this.http.post<AuthTokens>(`${this.api}auth/refresh/`, { refresh }).pipe(
      tap(tokens => this.storeTokens(tokens))
    );
  }

  fetchMe() {
    this.http.get<User>(`${this.api}auth/me/`).subscribe({
      next: user => this.currentUser.set(user),
      error: () => this.logout(),
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private storeTokens(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
  }
}
