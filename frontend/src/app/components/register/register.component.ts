import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card glass-card fade-in-up">
        <div class="auth-header">
          <span class="auth-icon">✨</span>
          <h1>Join Bookly</h1>
          <p>Create your account and start sharing reviews</p>
        </div>

        <form (ngSubmit)="onRegister()" class="auth-form">
          <div class="field">
            <label for="reg-username">Username</label>
            <input
              type="text"
              id="reg-username"
              [(ngModel)]="username"
              name="username"
              placeholder="Choose a username"
              required
              autocomplete="username"
            >
          </div>

          <div class="field">
            <label for="reg-email">Email</label>
            <input
              type="email"
              id="reg-email"
              [(ngModel)]="email"
              name="email"
              placeholder="your@email.com"
              required
              autocomplete="email"
            >
          </div>

          <div class="field">
            <label for="reg-password">Password</label>
            <input
              type="password"
              id="reg-password"
              [(ngModel)]="password"
              name="password"
              placeholder="Min. 6 characters"
              required
              minlength="6"
              autocomplete="new-password"
            >
          </div>

          <div class="field">
            <label for="reg-confirm">Confirm Password</label>
            <input
              type="password"
              id="reg-confirm"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              placeholder="Repeat your password"
              required
              autocomplete="new-password"
            >
          </div>

          @if (error()) {
            <p class="error-msg">{{ error() }}</p>
          }

          <button type="submit" class="submit-btn" [disabled]="loading()">
            @if (loading()) {
              <span class="btn-spinner"></span> Creating account...
            } @else {
              Create Account
            }
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .auth-header h1 {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }
    .auth-header p { color: var(--text-secondary); font-size: 0.95rem; }

    .field { margin-bottom: 1rem; }
    label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 500;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 0.95rem;
      font-family: var(--font-body);
      outline: none;
      transition: all var(--transition-fast);
    }
    input:focus { border-color: var(--accent-primary); box-shadow: var(--shadow-glow); }
    input::placeholder { color: var(--text-muted); }

    .error-msg {
      color: var(--accent-danger);
      font-size: 0.88rem;
      text-align: center;
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 77, 106, 0.1);
    }

    .submit-btn {
      width: 100%;
      padding: 0.8rem;
      border-radius: var(--radius-md);
      background: var(--accent-gradient);
      color: white;
      border: none;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .submit-btn:disabled { opacity: 0.7; cursor: default; }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .auth-footer a { color: var(--accent-primary); font-weight: 600; }
  `],
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }
    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.register({
      username: this.username,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        const errors = err.error;
        if (typeof errors === 'object') {
          const firstKey = Object.keys(errors)[0];
          this.error.set(errors[firstKey]?.[0] || 'Registration failed.');
        } else {
          this.error.set('Registration failed. Please try again.');
        }
      },
    });
  }
}
