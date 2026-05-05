import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/feed/feed.component').then(m => m.FeedComponent) },
  { path: 'books', loadComponent: () => import('./components/books/books.component').then(m => m.BooksComponent) },
  { path: 'books/:id', loadComponent: () => import('./components/book-detail/book-detail.component').then(m => m.BookDetailComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'favorites', loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
