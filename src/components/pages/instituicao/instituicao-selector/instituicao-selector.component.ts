import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, InstituicaoSimples } from '../../../../core/services/auth/auth.service';
import { Instituicao } from '../../../../core/services/instituicao/instituicao.service';

@Component({
  selector: 'app-instituicao-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './instituicao-selector.component.html',
  styleUrl: './instituicao-selector.component.css',
})
export class InstituicaoSelectorComponent implements OnInit {
  instituicoes: InstituicaoSimples[] = [];
  instituicaoSelecionadaId: number | null = null;
  email = '';
  erro = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras?.state as {
      instituicoes?: Instituicao[],
      email?: string
    };

    if (state?.instituicoes && state.email) {
      this.instituicoes = state.instituicoes;
      this.email = state.email;
      console.log('Instituições e e-mail recebidos do state:', this.instituicoes, this.email);
      return;
    }

    const instituicoesSalvas = this.authService.getInstituicoes();
    const emailSalvo = this.authService.getEmail();

    if (instituicoesSalvas && emailSalvo) {
      this.instituicoes = instituicoesSalvas;
      this.email = emailSalvo;
      console.log('Instituições e e-mail recuperados do storage:', this.instituicoes, this.email);
      return;
    }

    this.erro = 'Erro ao carregar instituições. Tente fazer login novamente.';
  }

  selecionarInstituicao(): void {
    this.limparErros();

    if (!this.validarSelecao()) return;

    this.carregando = true;

    console.log('Enviando e-mail:', this.email); 

    this.authService.finalizarLogin({
      email: this.email,
      instituicaoId: this.instituicaoSelecionadaId!
    }).subscribe({
      next: ({ token }) => {
        this.carregando = false;
        token ? this.router.navigate(['/main']) : this.definirErro('Erro ao finalizar login.');
      },
      error: (err) => {
        console.error('Erro ao finalizar login:', err);
        this.definirErro('Erro ao finalizar login. Verifique sua conexão ou tente novamente.');
        this.carregando = false;
      }
    });
  }

  private limparErros(): void {
    this.erro = '';
  }

  private validarSelecao(): boolean {
    if (!this.instituicaoSelecionadaId) {
      this.definirErro('Selecione uma instituição.');
      return false;
    }

    if (!this.email) {
      this.definirErro('Email não encontrado. Tente novamente.');
      return false;
    }

    return true;
  }

  private definirErro(mensagem: string): void {
    this.erro = mensagem;
  }
}
