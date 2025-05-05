import { Component } from '@angular/core';
import { User, UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  usuarios: User[] = [];

  constructor(private usuarioService: UsuarioService, public router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    const instituicaoId = this.authService.getInstituicaoId();
  
    if (instituicaoId) {
      this.usuarioService.getUsuarioByInstituicao(instituicaoId).subscribe(
        (data) => {
          this.usuarios = data;
        },
        (error) => {
          console.error('Erro ao buscar usuários', error);
        }
      );
    } else {
      console.error('Instituição não encontrada no token ou storage.');
    }
  }
  

  deletarUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.deleteUsuario(id).subscribe(
        () => {
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
        },
        (error) => {
          console.error('Erro ao deletar usuário', error);
        }
      );
    }
  }

   editarUsuario(id: number): void {
     this.router.navigate(['usuario_edit/', id]);
   }
}
