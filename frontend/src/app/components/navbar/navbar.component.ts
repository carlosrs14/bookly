import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">Bookly</span>
        </a>

        <button class="mobile-toggle" (click)="menuOpen.set(!menuOpen())" [attr.aria-label]="'Toggle menu'">
          <span class="bar" [class.open]="menuOpen()"></span>
          <span class="bar" [class.open]="menuOpen()"></span>
          <span class="bar" [class.open]="menuOpen()"></span>
        </button>

        <ul class="nav-links" [class.open]="menuOpen()">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="menuOpen.set(false)">Feed</a></li>
          <li><a routerLink="/books" routerLinkActive="active" (click)="menuOpen.set(false)">Books</a></li>
          @if (auth.isAuthenticated()) {
            <li><a routerLink="/favorites" routerLinkActive="active" (click)="menuOpen.set(false)">Favorites</a></li>
          }
        </ul>

        <div class="nav-actions" [class.open]="menuOpen()">
          @if (auth.isAuthenticated()) {
            <a routerLink="/profile" class="user-btn" (click)="menuOpen.set(false)">
              @if (auth.currentUser()?.profile?.avatar) {
                <img [src]="auth.currentUser()!.profile!.avatar" alt="avatar" class="avatar-img">
              } @else {
                <span class="avatar-placeholder">{{ auth.currentUser()?.username?.charAt(0)?.toUpperCase() }}</span>
              }
              <span class="username">{{ auth.currentUser()?.username }}</span>
            </a>
            <button class="btn-logout" (click)="auth.logout(); menuOpen.set(false)">Logout</button>
          } @else {
            <a routerLink="/login" class="btn-login" (click)="menuOpen.set(false)">Sign In</a>
            <a routerLink="/register" class="btn-register" (click)="menuOpen.set(false)">Sign Up</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.5rem;
      gap: 2rem;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 1.4rem;
      color: var(--text-primary);
    }
    .logo:hover { color: var(--accent-primary); }
    .logo-icon { font-size: 1.6rem; }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 0.25rem;
    }
    .nav-links a {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }
    .nav-links a:hover { color: var(--text-primary); background: rgba(108, 99, 255, 0.08); }
    .nav-links a.active { color: var(--accent-primary); background: rgba(108, 99, 255, 0.12); }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .avatar-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--accent-primary);
    }
    .avatar-placeholder {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
    }
    .username { color: var(--text-secondary); }
    .btn-login {
      padding: 0.45rem 1.2rem;
      border-radius: var(--radius-full);
      color: var(--accent-primary);
      border: 1px solid var(--accent-primary);
      font-weight: 500;
      font-size: 0.9rem;
      transition: all var(--transition-fast);
    }
    .btn-login:hover { background: rgba(108, 99, 255, 0.1); color: var(--accent-primary-hover); }
    .btn-register {
      padding: 0.45rem 1.2rem;
      border-radius: var(--radius-full);
      background: var(--accent-gradient);
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all var(--transition-fast);
    }
    .btn-register:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-logout {
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      background: none;
      border: 1px solid var(--accent-danger);
      color: var(--accent-danger);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-logout:hover { background: rgba(255, 77, 106, 0.1); }

    /* Mobile */
    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .bar {
      width: 24px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 2px;
      transition: all var(--transition-normal);
    }
    .bar.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .bar.open:nth-child(2) { opacity: 0; }
    .bar.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    @media (max-width: 768px) {
      .mobile-toggle { display: flex; }
      .nav-links, .nav-actions {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border-subtle);
        padding: 1rem 1.5rem;
      }
      .nav-links.open, .nav-actions.open { display: flex; }
      .nav-actions.open { border-top: 1px solid var(--border-subtle); }
    }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
  menuOpen = signal(false);
}
