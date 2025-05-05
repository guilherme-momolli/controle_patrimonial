import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  usuarioNome: string = '';
  nomeInstituicao: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.authService.authStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLogged => {
        this.isLoggedIn = isLogged;
        isLogged ? this.carregarDadosUsuario() : this.resetarDadosUsuario();
      });
  
    this.aplicarModoEscuro();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    const darkModeAtivo = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeAtivo ? 'enabled' : '');
  }

  closeDropdown(event: Event) {
    event.stopPropagation();
    const dropdown = (event.currentTarget as HTMLElement).closest('.dropdown');
    const menu = dropdown?.querySelector('.dropdown-menu.show');
    menu?.classList.remove('show');
  }

  // 🔽 PRIVADOS

  private carregarDadosUsuario() {
    this.usuarioNome = this.authService.getUsuarioNome() || 'Usuário';
  
    this.nomeInstituicao = this.authService.getInstituicaoNome();
    console.log('🏛️ Nome da instituição carregado do AuthService:', this.nomeInstituicao);
  }

  private resetarDadosUsuario() {
    this.usuarioNome = '';
    this.nomeInstituicao = null;
  }

  private aplicarModoEscuro() {
    if (this.isModoEscuroHabilitado()) {
      document.body.classList.add('dark-mode');
    }
  }

  private isModoEscuroHabilitado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('darkMode') === 'enabled';
    }
    return false;
  }

}
