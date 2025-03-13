import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Hardware, HardwareService } from '../../../core/services/hardware/hardware.service';
import { RelatorioService } from '../../../core/services/relatorio/relatorio.service';

@Component({
  selector: 'app-hardware-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hardware-list.component.html',
  styleUrl: './hardware-list.component.css'
})
export class HardwareListComponent implements OnInit {

 hardwares: Hardware[] = [];

  constructor(
    private hardwareService: HardwareService,
    public router: Router,
    private relatorioService: RelatorioService
  ) {}

  ngOnInit(): void {
    this.carregarHardwares();
  }

  getImagemUrl(imagemUrl: string | undefined): string {
    return this.hardwareService.getImagemUrl(imagemUrl);
  }

  gerarRelatorio(): void{
    this.relatorioService.gerearRelatorioHardware(this.hardwares);
  }
  
  carregarHardwares(): void {
    this.hardwareService.getHardwares().subscribe(
      (data) => {
        this.hardwares = data.map(hardware => ({
          ...hardware,
          imagemUrl: this.hardwareService.getImagemUrl(hardware.imagemUrl)
        }));
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
          this.hardwares = this.hardwares.filter(hardware => hardware.id !== id);
        },
        (error) => {
          console.error('Erro ao deletar hardware', error);
        }
      );
    }
  }

  editarHardware(id: number): void {
    this.router.navigate(['hardware_edit/', id]);
  }

  cadastrarHardware(): void{
    this.router.navigate(['hardware_create'])
  }
}

