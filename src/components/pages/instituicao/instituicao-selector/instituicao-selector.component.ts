import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, NavigationStart, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Instituicao } from '../../../../core/services/instituicao/instituicao.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instituicao-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './instituicao-selector.component.html',
  styleUrl: './instituicao-selector.component.css',
})
export class InstituicaoSelectorComponent implements OnInit {
  instituicoes: Instituicao[] = [];
  instituicaoSelecionadaId: number | null = null;
  email: string = '';
  erro: string = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { instituicoes?: Instituicao[], email?: string };

    if (state?.instituicoes?.length && state.email) {
      this.instituicoes = state.instituicoes;
      this.email = state.email;
    } else {
      this.erro = 'Erro ao carregar instituições. Tente fazer login novamente.';
    }
  }

  selecionarInstituicao(): void {
    this.erro = '';

    if (!this.instituicaoSelecionadaId) {
      this.erro = 'Selecione uma instituição.';
      return;
    }

    if (!this.email) {
      this.erro = 'Email não encontrado. Tente novamente.';
      return;
    }

    this.carregando = true;

    this.authService.finalizarLogin(this.email, this.instituicaoSelecionadaId).subscribe({
      next: (res) => {
        this.carregando = false;
        if (res.token) {
          this.router.navigate(['/main']);
        } else {
          this.erro = 'Erro ao finalizar login.';
        }
      },
      error: (err) => {
        console.error('Erro ao finalizar login:', err);
        this.erro = 'Erro ao finalizar login. Verifique sua conexão ou tente novamente.';
        this.carregando = false;
      }
    });
  }
}
