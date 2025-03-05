import { Component, OnInit } from '@angular/core';
import { Hardware, HardwareService } from '../../../core/services/hardware/hardware.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hardware-patrimonial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hardware-patrimonial.component.html',
  styleUrl: './hardware-patrimonial.component.css'
})
export class HardwarePatrimonialComponent implements OnInit {
  
  hardwaresAgrupados: { [codigoPatrimonial: string]: Hardware[] } = {};

  constructor(private hardwareService: HardwareService) {}

  ngOnInit(): void {
    this.hardwareService.getHardwaresAgrupados().subscribe(data => {
      this.hardwaresAgrupados = data;
    });
  }

  // Retorna uma lista única de códigos patrimoniais
  getCodigosUnicos(): string[] {
    return Object.keys(this.hardwaresAgrupados);
  }

  // Retorna o nome do modelo e fabricante do componente específico
  getComponenteNome(hardwares: Hardware[], tipoComponente: string): string {
    const hardware = hardwares.find(h => h.componente === tipoComponente);
    return hardware ? `${hardware.modelo} (${hardware.fabricante})` : "-";
  }
  getCodigosPatrimoniais(): string[] {
    return Object.keys(this.hardwaresAgrupados);
  }
  // Calcula o preço total de todos os componentes do mesmo código patrimonial
  getTotalPreco(hardwares: Hardware[] = []): number {
    return hardwares.reduce((total, hardware) => total + (hardware.precoTotal || 0), 0);
  }
  // Edita o hardware com um determinado código patrimonial
  editarHardware(codigo: string): void {
    console.log(`Editar hardware com código patrimonial: ${codigo}`);
  }

  // Deleta todos os componentes de um código patrimonial
  deletarHardware(codigo: string): void {
    if (confirm(`Tem certeza que deseja deletar os hardwares com código patrimonial ${codigo}?`)) {
      const hardwaresParaDeletar = this.hardwaresAgrupados[codigo] || [];

      hardwaresParaDeletar.forEach(hardware => {
        this.hardwareService.deleteHardware(hardware.id).subscribe(
          () => {
            delete this.hardwaresAgrupados[codigo];
          },
          (error) => {
            console.error(`Erro ao deletar hardware ${hardware.id}:`, error);
          }
        );
      });
    }
  }
}
