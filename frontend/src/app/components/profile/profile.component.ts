import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <div class="profile-page">
      <div class="profile-card glass-card fade-in-up">
        <div class="avatar-section">
          @if (auth.currentUser()?.profile?.avatar) {
            <img [src]="auth.currentUser()!.profile!.avatar" alt="avatar" class="avatar-large">
          } @else {
            <div class="avatar-large-placeholder">
              {{ auth.currentUser()?.username?.charAt(0)?.toUpperCase() }}
            </div>
          }

          <label for="avatar-upload" class="upload-btn">
            📷 Change Avatar
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              (change)="onAvatarChange($event)"
              hidden
            >
          </label>
        </div>

        <div class="info-section">
          <h1 class="username">{{ auth.currentUser()?.username }}</h1>
          <p class="email">{{ auth.currentUser()?.email }}</p>

          @if (auth.currentUser()?.profile?.bio) {
            <p class="bio">{{ auth.currentUser()!.profile!.bio }}</p>
          }
        </div>

        @if (successMsg()) {
          <p class="success-msg">{{ successMsg() }}</p>
        }

        <button class="logout-btn" (click)="auth.logout()">Sign Out</button>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .profile-card {
      width: 100%;
      max-width: 480px;
      padding: 2.5rem;
      text-align: center;
    }
    .avatar-section { margin-bottom: 1.5rem; }
    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--accent-primary);
      margin-bottom: 0.75rem;
    }
    .avatar-large-placeholder {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--accent-gradient);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.75rem;
    }
    .upload-btn {
      display: inline-block;
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .upload-btn:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    .username {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }
    .email {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }
    .bio {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      padding: 1rem;
      background: var(--bg-input);
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
    }

    .success-msg {
      color: var(--accent-secondary);
      font-size: 0.88rem;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      background: rgba(0, 212, 170, 0.1);
      margin-bottom: 1rem;
    }

    .logout-btn {
      width: 100%;
      padding: 0.7rem;
      border-radius: var(--radius-md);
      background: transparent;
      border: 1px solid var(--accent-danger);
      color: var(--accent-danger);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      margin-top: 1rem;
    }
    .logout-btn:hover { background: rgba(255, 77, 106, 0.1); }
  `],
})
export class ProfileComponent {
  auth = inject(AuthService);
  private http = inject(HttpClient);

  successMsg = signal('');

  onAvatarChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    this.http.patch(`${environment.apiUrl}auth/profile/`, formData).subscribe({
      next: () => {
        this.successMsg.set('Avatar updated successfully!');
        this.auth.fetchMe();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: () => this.successMsg.set('Failed to update avatar.'),
    });
  }
}
