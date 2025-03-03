import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario/usuario.service';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  userForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  submitForm() {
    if (this.userForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.usuarioService.createUsuario(this.userForm.value).subscribe({
      next: () => {
        this.successMessage = 'Usuário cadastrado com sucesso!';
        this.userForm.reset();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Erro ao cadastrar usuário!';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
