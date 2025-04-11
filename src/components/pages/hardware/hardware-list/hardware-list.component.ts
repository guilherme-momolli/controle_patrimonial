import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Hardware, HardwareService } from '../../../../core/services/hardware/hardware.service';
import { RelatorioService } from '../../../../core/services/relatorio/relatorio.service';
import { Componente, Estatus } from '../hardware.enum';

declare var bootstrap: any;

@Component({
  selector: 'app-hardware-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './hardware-list.component.html',
  styleUrls: ['./hardware-list.component.css']
})
export class HardwareListComponent implements OnInit, AfterViewInit {
  hardwareForm: FormGroup;
  hardwareSelecionado: any;
  hardwares: Hardware[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;
  imagemUrl?: string | null;
  selectedFile?: File;

  componentes = Object.values(Componente);
  estatusList = Object.values(Estatus);

  @ViewChild('hardwareCreateModal') hardwareCreateModal!: ElementRef;
  private modalCreateInstance: any;

  @ViewChild('hardwareEditModal') hardwareEditModal!: ElementRef;
  private modalEditInstance: any;

  imagemAmpliada: string | null = null;
  @ViewChild('imagemModal') imagemModal!: ElementRef;
  private modalImagemInstance: any;

  page = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private hardwareService: HardwareService,
    private router: Router,
    private relatorioService: RelatorioService
  ) {
    this.hardwareForm = this.fb.group({
      id: [null],
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

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagemArquivo = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagemPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imagemArquivo);
    }
  }

  ngOnInit(): void {
    this.carregarHardwares();
  }

  ngAfterViewInit(): void {
    if (this.hardwareCreateModal) {
      this.modalCreateInstance = new bootstrap.Modal(this.hardwareCreateModal.nativeElement);
    }
    if (this.hardwareEditModal) {
      this.modalEditInstance = new bootstrap.Modal(this.hardwareEditModal.nativeElement);
    }
    if (this.imagemModal) {
    this.modalImagemInstance = new bootstrap.Modal(this.imagemModal.nativeElement);
    }
  }

  carregarHardwares(): void {
    this.hardwareService.getHardwares().subscribe({
      next: (data) => {
        this.hardwares = data.map(hardware => ({
          ...hardware,
          imagemUrl: 'assets/default-image.png'
        }));

        this.hardwares.forEach(hardware => {
          this.hardwareService.getImagemUrlById(hardware.id).subscribe({
            next: (url) => {
              hardware.imagemUrl = url;
            },
            error: (error) => {
              console.error(`Erro ao obter a URL da imagem do hardware ID ${hardware.id}:`, error);
            }
          });
        });
      },
      error: (error) => {
        console.error('Erro ao buscar hardwares:', error);
      }
    });
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

  editarHardware(hardwareId: number) {
    this.hardwareService.getHardwareById(hardwareId).subscribe((hardware) => {
      this.hardwareSelecionado = hardware;
      this.hardwareForm.patchValue(hardware);

      if (hardware.imagemUrl) {
        this.imagemUrl = this.hardwareService.getImagemUrl(hardware.imagemUrl);
        this.imagemPreview = this.imagemUrl;
      } else {
        this.imagemPreview = null;
      }

      this.modalEditInstance.show();
    });
  }

  salvarEdicao(): void {
    if (this.hardwareForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const id = this.hardwareForm.value.id;
    if (!id) return;

    const hardwareData: Hardware = this.hardwareForm.value;
    const imagem: File | undefined = this.imagemArquivo || undefined;

    this.hardwareService.updateHardware(id, hardwareData, imagem).subscribe({
      next: (hardwareAtualizado) => {
        console.log('Hardware atualizado com sucesso', hardwareAtualizado);
        this.carregarHardwares();
        this.successMessage = 'Hardware atualizado com sucesso!';
      },
      error: (erro) => {
        console.error('Erro ao atualizar hardware:', erro);
        this.errorMessage = 'Erro ao atualizar hardware!';
      },
      complete: () => {
        this.isSubmitting = false;
        this.modalEditInstance.hide();
        this.hardwareForm.reset();
        this.imagemPreview = null;
        this.imagemArquivo = null;


      }
    });
  }

  onSubmit() {
    if (this.hardwareForm.valid) {
      const hardware: Hardware = this.hardwareForm.value;
      const imagem: File | undefined = this.imagemArquivo || undefined; // Garante que não seja null

      this.hardwareService.createHardware(hardware, imagem).subscribe({
        next: (novoHardware) => {
          console.log('Hardware cadastrado com sucesso!', novoHardware);
          this.successMessage = 'Hardware cadastrado com sucesso!';
          this.hardwares.push(novoHardware);
          this.imagemUrl = this.hardwareService.getImagemUrl(novoHardware.imagemUrl);

          this.hardwareForm.reset();
          this.imagemPreview = null;
          this.imagemArquivo = null;

        },
        error: (error) => {
          console.error('Erro ao cadastrar hardware:', error);
          this.errorMessage = 'Erro ao cadastrar hardware!';
        },
      });
    }
  }

  submitForm(event: Event): void {
    event.preventDefault();

    if (this.hardwareForm.invalid || this.isSubmitting) {
      console.warn('Formulário inválido');
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const hardwareData: Hardware = {
      ...this.hardwareForm.value,
      componente: this.hardwareForm.value.componente.toUpperCase(),
      estatus: this.hardwareForm.value.estatus.toUpperCase(),
    };

    const imagem: File | undefined = this.imagemArquivo || undefined;

    this.hardwareService.createHardware(hardwareData, imagem).subscribe({
      next: (hardwareCriado) => {
        console.log('Hardware cadastrado com sucesso!', hardwareCriado);
        this.successMessage = 'Hardware cadastrado com sucesso!';
        this.hardwares.push(hardwareCriado);
        this.imagemUrl = this.hardwareService.getImagemUrl(hardwareCriado.imagemUrl);

        this.hardwareForm.reset();
        this.imagemPreview = null;
        this.imagemArquivo = null;
      },
      error: (erro) => {
        console.error('Erro ao cadastrar hardware!', erro);
        this.errorMessage = 'Erro ao cadastrar hardware!';
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  gerarRelatorio(): void {
    this.relatorioService.gerarRelatorioHardware(this.hardwares);
  }

  abrirImagemModal(imagemUrl?: string): void {
    console.log("Imagem recebida:", imagemUrl);
  
    if (imagemUrl) {
      // Verifica se a URL já contém "http" para evitar duplicação
      this.imagemAmpliada = imagemUrl.startsWith('http') ? imagemUrl : this.hardwareService.getImagemUrl(imagemUrl);
    } else {
      this.imagemAmpliada = 'assets/default-image.png';
    }
  
    console.log("Imagem final para exibição:", this.imagemAmpliada);
    this.modalImagemInstance.show();
  }
  

  fecharImagemModal(): void {
    this.modalImagemInstance.hide();
    this.imagemAmpliada = null;
  }

  abrirModalCreate(): void {
    this.hardwareForm.reset();
    this.imagemPreview = null;
    this.imagemArquivo = null;
    this.selectedFile = undefined;

    this.modalCreateInstance.show();
  }

  fecharModalCreate(): void {
    this.hardwareForm.reset();
    this.imagemPreview = null;
    this.imagemArquivo = null;
    this.selectedFile = undefined;

    this.modalCreateInstance.hide();
  }

  selecionarImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagemArquivo = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagemPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imagemArquivo);
    }
  }
}
