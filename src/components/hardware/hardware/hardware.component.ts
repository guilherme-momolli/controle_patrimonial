import { Component } from '@angular/core';
import { Hardware, HardwareService } from '../../../core/services/hardware/hardware.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-hardware',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hardware.component.html',
  styleUrl: './hardware.component.css'
})
export class HardwareComponent {
  hardwares: Hardware[] = [];

  constructor(private hardwareService: HardwareService, public router: Router) {}
  
  ngOnInit(): void {
    this.carregarHardwares();
  }

  carregarHardwares(): void {
    this.hardwareService.getHardwares().subscribe(
      (data) => {
        this.hardwares = data;
      },
      (error) => {
        console.error('Erro ao buscar hardwares', error);
      }
    );
  }

  deletarHardware(id: number): void {
    if (confirm('Tem certeza que deseja excluir este hardware?')) {
      this.hardwareService.deleteHardware(id).subscribe(
        () => {
          this.hardwares = this.hardwares.filter(hardwares => hardwares.id !== id);
        },
        (error) => {
          console.error('Erro ao deletar usuário', error);
        }
      );
    }
  }

  editarHardware(id: number): void {
    this.router.navigate(['hardware_edit/', id]);
  }
}