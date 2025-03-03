import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  navigateToCadastro() {
    this.router.navigate(['/singup']);
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
  
      this.authService.login({ email, senha }).subscribe({
        next: (response) => {
          if (response?.token) {
            this.authService.setToken(response.token);
            console.log(this.authService.getToken);
            this.router.navigate(['/main']);
          } else {
            this.errorMessage = 'Erro ao fazer login, tente novamente!';
          }
        },
        error: () => {
          this.errorMessage = 'Email ou senha inválidos!';
        }
      });
    }
  }
}
