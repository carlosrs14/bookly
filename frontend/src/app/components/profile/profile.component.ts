import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
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
