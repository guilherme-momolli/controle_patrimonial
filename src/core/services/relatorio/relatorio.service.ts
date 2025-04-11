import { Injectable } from '@angular/core'; 
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Hardware } from '../hardware/hardware.service';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor() {}

  gerarRelatorioHardware(hardwares: Hardware[]) {
    const doc = new jsPDF();
    
    // Adiciona um logotipo (se disponível)
    const logoUrl = ''; // Insira a imagem como Base64 ou carregue dinamicamente
    if (logoUrl) {
      doc.addImage(logoUrl, 'JPEG', 10, 10, 30, 30);
    }

    // Título centralizado
    doc.setFontSize(16);
    const titulo = 'Relatório de Hardwares';
    const textWidth = doc.getTextWidth(titulo);
    doc.text(titulo, (doc.internal.pageSize.width - textWidth) / 2, 20);

    // Tabela de dados
    const tableData = hardwares.map(hardware => [
      hardware.id,
      hardware.codigoPatrimonial,
      hardware.componente,
      hardware.numeroSerial || '-',
      hardware.modelo,
      hardware.fabricante,
      hardware.velocidade || '-',
      hardware.capacidadeArmazenamento || '-',
      hardware.estatus || '-',
      `R$ ${(hardware.precoTotal || 0).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [[
        'ID', 'Código', 'Componente', 'Número Serial', 'Modelo', 'Fabricante', 
        'Velocidade', 'Armazenamento', 'Estatus', 'Preço'
      ]],
      body: tableData,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3, valign: 'middle', halign: 'center' },
    });

    // Rodapé com data de emissão
    const dataAtual = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Data de emissão: ${dataAtual}`, 14, doc.internal.pageSize.height - 20);

    // Espaço para assinatura
    doc.line(14, doc.internal.pageSize.height - 10, 80, doc.internal.pageSize.height - 10);
    doc.text('Assinatura do Responsável', 14, doc.internal.pageSize.height - 5);

    doc.save('relatorio_hardwares.pdf');
  }

  gerarRelatorioPatrimonio(hardwaresAgrupados: { [codigoPatrimonial: string]: Hardware[] }) {
    const doc = new jsPDF();

    // Adiciona um logotipo (se disponível)
    const logoUrl = '';
    if (logoUrl) {
      doc.addImage(logoUrl, 'JPEG', 10, 10, 30, 30);
    }

    // Título centralizado
    doc.setFontSize(16);
    const titulo = 'Relatório de Patrimônios';
    const textWidth = doc.getTextWidth(titulo);
    doc.text(titulo, (doc.internal.pageSize.width - textWidth) / 2, 20);

    // Tabela de dados
    const tableData = Object.keys(hardwaresAgrupados).map((codigo) => [
      codigo,
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Gabinete'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Armazenamento'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Fonte de alimentação'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Memória RAM'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Placa mãe'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Placa de vídeo'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Placa Wi-Fi'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Processador'),
      this.getComponenteNome(hardwaresAgrupados[codigo], 'Cooler'),
      `R$ ${(this.getTotalPreco(hardwaresAgrupados[codigo]) || 0).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [[
        'Código', 'Gabinete', 'Armazenamento', 'Fonte', 'RAM', 'Placa Mãe', 
        'Vídeo', 'Wi-Fi', 'Processador', 'Cooler', 'Preço Total'
      ]],
      body: tableData,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3, valign: 'middle', halign: 'center' },
    });

    // Rodapé com data de emissão
    const dataAtual = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Data de emissão: ${dataAtual}`, 14, doc.internal.pageSize.height - 20);

    // Espaço para assinatura
    doc.line(14, doc.internal.pageSize.height - 10, 80, doc.internal.pageSize.height - 10);
    doc.text('Assinatura do Responsável', 14, doc.internal.pageSize.height - 5);

    doc.save('relatorio_patrimonios.pdf');
  }

  private getComponenteNome(hardwares: Hardware[], tipoComponente: string): string {
    const hardware = hardwares.find(h => h.componente.toLowerCase() === tipoComponente.toLowerCase());
    return hardware ? `${hardware.modelo} (${hardware.fabricante})` : '-';
  }

  private getTotalPreco(hardwares: Hardware[]): number {
    return hardwares.reduce((total, hardware) => total + (hardware.precoTotal || 0), 0);
  }
}
