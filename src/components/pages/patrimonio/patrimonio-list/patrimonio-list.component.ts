import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Hardware, HardwareService } from '../../../../core/services/hardware/hardware.service';
import { CommonModule } from '@angular/common';

import { RelatorioService } from '../../../../core/services/relatorio/relatorio.service';

@Component({
  selector: 'app-patrimonio-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patrimonio-list.component.html',
  styleUrl: './patrimonio-list.component.css'
})
export class PatrimonioListComponent implements OnInit {
  
  hardwaresAgrupados: { [codigoPatrimonial: string]: Hardware[] } = {};

  constructor(private hardwareService: HardwareService,
    private cdRef: ChangeDetectorRef,
    private relatorioService: RelatorioService) {}

  ngOnInit(): void {
    this.hardwareService.getHardwaresAgrupados().subscribe(data => {
      this.hardwaresAgrupados = { ...data };
      this.cdRef.detectChanges();
    });
  }

  gerarRelatorio() {
    this.relatorioService.gerarRelatorioPatrimonio(this.hardwaresAgrupados);
  }

  carregarHardwares(): void {
    this.hardwareService.getHardwaresAgrupados().subscribe(data => {
      this.hardwaresAgrupados = data;
    });
  }

  getCodigosPatrimoniais(): string[] {
    return Object.keys(this.hardwaresAgrupados);
  }

  getComponenteNome(hardwares: Hardware[], tipoComponente: string): string {
    const tipoNormalizado = tipoComponente.toLowerCase().replace(/_/g, ' ');
    const hardware = hardwares.find(h => h.componente.toLowerCase() === tipoNormalizado);
    return hardware ? `${hardware.modelo} (${hardware.fabricante})` : "-";
  }
  
  getTotalPreco(hardwares: Hardware[] = []): number {
    return hardwares.reduce((total, hardware) => total + (hardware.precoTotal || 0), 0);
  }

  editarHardware(codigo: string): void {
    console.log(`Editar hardware com código patrimonial: ${codigo}`);
  }

  deletarHardware(codigo: string): void {
    if (confirm(`Tem certeza que deseja deletar os hardwares com código patrimonial ${codigo}?`)) {
      const hardwaresParaDeletar = this.hardwaresAgrupados[codigo] || [];

      let deletados = 0;
      hardwaresParaDeletar.forEach(hardware => {
        this.hardwareService.deleteHardware(hardware.id).subscribe(
          () => {
            deletados++;
            if (deletados === hardwaresParaDeletar.length) {
              this.carregarHardwares();
            }
          },
          (error) => {
            console.error(`Erro ao deletar hardware ${hardware.id}:`, error);
          }
        );
      });
    }
  }
}
