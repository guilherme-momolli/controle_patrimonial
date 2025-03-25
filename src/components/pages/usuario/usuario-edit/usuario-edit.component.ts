import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuario-edit.component.html',
  styleUrl: './usuario-edit.component.css'
})
export class UsuarioEditComponent implements OnInit {
  usuario: any = { id: null, nome: '', email: '', senha: ''};

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarUsuario(parseInt(id));
    }
  }

  carregarUsuario(id: number): void {
    this.usuarioService.getUsuarioById(id).subscribe(
      (data) => {
        this.usuario = data;
      },
      (error) => {
        console.error('Erro ao carregar usuário', error);
      }
    );
  }

  salvarEdicao(): void {
    this.usuarioService.updateUsuario(this.usuario).subscribe(
      () => {
        alert('Usuário atualizado com sucesso!');
        this.router.navigate(['/usuario_list']);
      },
      (error) => {
        console.error('Erro ao atualizar usuário', error);
      }
    );
  }
}
