import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
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

    this.auth.register({ username: this.username, email: this.email, password: this.password }).subscribe({
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
