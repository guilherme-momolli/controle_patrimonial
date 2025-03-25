import { Injectable } from '@angular/core'; 
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Hardware } from '../hardware/hardware.service';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor() {}

  gerearRelatorioHardware(hardwares: Hardware[]){
    const doc = new jsPDF();
    const logoUrl = '';
    doc.addImage(logoUrl, 'JPEG', 10, 10, 30, 30); // (imagem, tipo, x, y, largura, altura)

    // Título
    doc.setFontSize(11);
    doc.text('Relatório de Hardwares', 75, 20);

    
    // Tabela
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
      `R$ ${hardware.precoTotal.toFixed(2)}`
  ]);

    autoTable(doc, {
      head: [[
        'ID', 'Código', 'Componente', 'Número Serial', 'Modelo', 'Fabricante', 'Velocidade', 'Armazenamento', 'Estatus', 'Preço'
      ]],
      body: tableData,
      startY: 50, // Define o início da tabela abaixo do título
      theme: 'grid',
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] }, // Fundo cinza escuro e texto branco no cabeçalho
      styles: { fontSize: 9, cellPadding: 3, valign: 'middle', halign: 'center' }, // Fonte menor e alinhamento
    });

    // Rodapé com data de emissão
    const dataAtual = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Data de emissão: ${dataAtual}`, 14, doc.internal.pageSize.height - 20);

    // Espaço para assinatura
    doc.line(14, doc.internal.pageSize.height - 10, 80, doc.internal.pageSize.height - 10); // Linha para assinatura
    doc.text('Assinatura do Responsável', 14, doc.internal.pageSize.height - 5);

    doc.save('relatorio_hardwares.pdf');
  }

  gerarRelatorioPatrimonio(hardwaresAgrupados: { [codigoPatrimonial: string]: Hardware[] }) {
    const doc = new jsPDF();

    // Adiciona um logotipo (substitua pela URL ou base64 da imagem)
    const logoUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fgear-wheel-icon-return-form-1715518%2F&psig=AOvVaw2NhzsfejYuiman7VlQ8SLw&ust=1741962419014000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCOD6mOuhh4wDFQAAAAAdAAAAABAE';
    doc.addImage(logoUrl, 'JPEG', 10, 10, 30, 30); // (imagem, tipo, x, y, largura, altura)

    // Título
    doc.setFontSize(16);
    doc.text('Relatório de Patrimônios', 75, 20);

    // Tabela
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
      `R$ ${this.getTotalPreco(hardwaresAgrupados[codigo]).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [[
        'Código', 'Gabinete', 'Armazenamento', 'Fonte', 'RAM', 'Placa Mãe', 'Vídeo', 'Wi-Fi', 'Processador', 'Cooler', 'Preço Total'
      ]],
      body: tableData,
      startY: 50, // Define o início da tabela abaixo do título
      theme: 'grid',
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255] }, // Fundo cinza escuro e texto branco no cabeçalho
      styles: { fontSize: 9, cellPadding: 3, valign: 'middle', halign: 'center' }, // Fonte menor e alinhamento
    });

    // Rodapé com data de emissão
    const dataAtual = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Data de emissão: ${dataAtual}`, 14, doc.internal.pageSize.height - 20);

    // Espaço para assinatura
    doc.line(14, doc.internal.pageSize.height - 10, 80, doc.internal.pageSize.height - 10); // Linha para assinatura
    doc.text('Assinatura do Responsável', 14, doc.internal.pageSize.height - 5);

    doc.save('relatorio_patrimonios.pdf');
  }

  private getComponenteNome(hardwares: Hardware[], tipoComponente: string): string {
    const tipoNormalizado = tipoComponente.toLowerCase().replace(/_/g, ' ');
    const hardware = hardwares.find(h => h.componente.toLowerCase() === tipoNormalizado);
    return hardware ? `${hardware.modelo} (${hardware.fabricante})` : '-';
  }

  private getTotalPreco(hardwares: Hardware[]): number {
    return hardwares.reduce((total, hardware) => total + (hardware.precoTotal || 0), 0);
  }
}
