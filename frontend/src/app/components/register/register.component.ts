import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }
  passwordMismatch = false;
  constructor(private http: HttpClient) {}

  checkPasswordMatch() {
    this.passwordMismatch = this.user.password !== this.user.passwordConfirm;
  }

  register() {
    if (this.passwordMismatch) {
      alert("Passwords Not match");
      return;
    }
    this.http.post(environment.apiUrl + 'user/', this.user).subscribe({
      next: (res) => alert('Registro exitoso'),
      error: (err) => alert('Error al registrarse: ' + JSON.stringify(err.error))
    });
  }
}
