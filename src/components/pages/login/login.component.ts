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
  carregando = false;
  
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
    if (this.loginForm.valid && !this.carregando) {
      this.carregando = true;
      const { email, senha } = this.loginForm.value;
      this.authService.login({ email, senha }).subscribe({
        next: (response) => {
          if (response.instituicoes && response.instituicoes.length > 1) {
            this.router.navigate(['/select_corporation'], {
              state: { instituicoes: response.instituicoes, email }
            });
            this.carregando = false;
          } else if (response.instituicoes && response.instituicoes.length === 1) {
            this.authService.finalizarLogin({
              email,
              instituicaoId: response.instituicoes[0].id
            }).subscribe({
              next: () => {
                this.router.navigate(['/main']);
                this.carregando = false;
              },
              error: (err) => {
                
                console.error('Erro ao finalizar login automático:', err);
                this.carregando = false;
              }
            });
          } else {
            console.error('Nenhuma instituição vinculada.');
            this.carregando = false;
          }
        },
        error: (err) => {
          console.error('Erro no login:', err);
          this.carregando = false;
        }
      });
    }
  }
  
  
}