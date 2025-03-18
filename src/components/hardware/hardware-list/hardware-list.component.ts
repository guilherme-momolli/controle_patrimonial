import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Hardware, HardwareService } from '../../../core/services/hardware/hardware.service';
import { RelatorioService } from '../../../core/services/relatorio/relatorio.service';
import { Componente, Estatus } from '../hardware.enum';

declare var bootstrap: any; // Para manipular o modal do Bootstrap

@Component({
  selector: 'app-hardware-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hardware-list.component.html',
  styleUrl: './hardware-list.component.css'
})
export class HardwareListComponent implements OnInit {

  hardwareForm: FormGroup;
  hardwares: Hardware[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;

  componentes = Object.values(Componente);
  estatusList = Object.values(Estatus);

  @ViewChild('hardwareModal') hardwareModal!: ElementRef;
  private modalInstance: any;

  constructor(
    private fb: FormBuilder,
    private hardwareService: HardwareService,
    private router: Router,
    private relatorioService: RelatorioService
  ) { 
    this.hardwareForm = this.fb.group({
      codigoPatrimonial: [''],
      componente: ['', Validators.required],
      numeroSerial: [''],
      modelo: ['', Validators.required],
      fabricante: ['', Validators.required],
      velocidade: [''],
      capacidadeArmazenamento: [''],
      precoTotal: ['', [Validators.required, Validators.min(0)]], 
      estatus: ['', Validators.required],
      imagemUrl: ['']
    });
  }

  ngOnInit(): void {
    this.carregarHardwares();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.hardwareModal.nativeElement);
  }

  getImagemUrl(imagemUrl: string | undefined): string {
    return this.hardwareService.getImagemUrl(imagemUrl);
  }

  gerarRelatorio(): void {
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

  abrirModal(): void {
    this.hardwareForm.reset();
    this.imagemPreview = null;
    this.imagemArquivo = null;
    this.modalInstance.show();
  }

  fecharModal(): void {
    this.modalInstance.hide();
  }

  selecionarImagem(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemArquivo = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagemPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  submitForm(event: Event): void {
    event.preventDefault();

    if (this.hardwareForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('hardware', new Blob([JSON.stringify(this.hardwareForm.value)], { type: 'application/json' }));

    if (this.imagemArquivo) {
      formData.append('imagem', this.imagemArquivo);
    }

    this.hardwareService.createHardware(formData).subscribe({
      next: (hardwareCriado) => {
        this.successMessage = 'Hardware cadastrado com sucesso!';
        this.hardwares.push(hardwareCriado);
        this.hardwareForm.reset();
        this.imagemPreview = null;
        this.imagemArquivo = null;
        this.fecharModal();
      },
      error: () => {
        this.errorMessage = 'Erro ao cadastrar hardware!';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
