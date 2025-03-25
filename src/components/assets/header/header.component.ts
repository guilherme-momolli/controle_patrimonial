import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  usuarioNome: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.verificarAutenticacao();

    // Verifica se o modo escuro já está ativado
    if (typeof localStorage !== 'undefined' && localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
    }
  }

  verificarAutenticacao() {
    if (typeof localStorage !== 'undefined') {
      const token = this.authService.getToken();
      this.isLoggedIn = !!token;

      if (this.isLoggedIn) {
        // Obtém o nome do usuário salvo no localStorage (caso seja armazenado no login)
        this.usuarioNome = localStorage.getItem('usuarioNome') || 'Usuário';
      }
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  closeDropdown(event: Event) {
    event.stopPropagation();
    let dropdown = document.querySelector('.dropdown-menu.show');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('usuarioNome'); // Remove o nome do usuário
      this.isLoggedIn = false;
      this.usuarioNome = ''; // Limpa o nome do usuário
      this.router.navigate(['/login']); // Redireciona para login
    }
  }

  toggleDarkMode() {
    if (typeof localStorage !== 'undefined') {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.removeItem('darkMode');
      }
    }
  }
}
