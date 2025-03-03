import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TopNavbarComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  isUserMenuOpen = false;

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
  ngOnInit() {
    console.log('✅ TopNavbarComponent carregado!');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}
