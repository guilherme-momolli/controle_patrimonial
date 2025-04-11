import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service'; 

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
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  navigateToCadastro() {
    this.router.navigate(['/signup']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      this.authService.login({ email, senha }).subscribe({
        next: (response) => {
          if (response.token) {
            this.router.navigate(['/main']);
          } else if (Array.isArray(response.instituicoes) && response.instituicoes.length > 0) {
            this.router.navigate(['/select_corporation'], {
              state: { instituicoes: response.instituicoes, email }
            });
          } else {
            this.errorMessage = 'Usuário não possui instituições vinculadas.';
          }
        },
        error: () => {
          this.errorMessage = 'Email ou senha inválidos!';
        }
      });
    }
  }
}