import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Hardware, HardwareService } from '../../../../core/services/hardware/hardware.service';
import { RelatorioService } from '../../../../core/services/relatorio/relatorio.service';
import { Componente, Estatus } from '../hardware.enum';
import { AuthService } from '../../../../core/services/auth/auth.service';

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
  hardwareSelecionado?: Hardware;
  hardwares: Hardware[] = [];
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;
  imagemUrl?: string | null;
  selectedFile?: File;
  modoEdicaoAtivado: boolean = false;
  editandoHardwareId: number | null = null;

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
    private relatorioService: RelatorioService,
    private authService: AuthService
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
      imagemUrl: [''],
      instituicao: ['']
    });
    this.imagemPreview = null;
    this.imagemArquivo = null;
    this.selectedFile = undefined;
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
    const instituicaoId = this.authService.getInstituicaoId();
  
    if (!instituicaoId) {
      console.warn('ID da instituição não encontrado. Usuário pode não estar autenticado.');
      return;
    }
  
    this.hardwareService.getHardwareByInstituicao(instituicaoId).subscribe({
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
              console.error(`Erro ao obter imagem do hardware ${hardware.id}:`, error);
            }
          });
        });
      },
      error: (error) => {
        console.error('Erro ao buscar hardwares da instituição:', error);
      }
    });
  }  

  deletarHardware(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID inválido: undefined');
      return;
    }
  
    if (confirm('Tem certeza que deseja excluir este hardware?')) {
      this.hardwareService.deleteHardware(id).subscribe(
        () => {
          this.hardwares = this.hardwares.filter(hardware => hardware.id !== id);
          this.modalEditInstance.hide();
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
        this.resetForm();
      }
    });
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.hardwareForm.invalid || this.isSubmitting) {
      console.warn('Formulário inválido ou já em submissão');
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const hardwareData: Hardware = {
      ...this.hardwareForm.value,
      instituicao: {
        id: this.authService.getInstituicaoId()
      }
    };

    const imagem: File | undefined = this.imagemArquivo || undefined;

    this.hardwareService.createHardware(hardwareData, imagem).subscribe({
      next: (hardwareCriado) => {
        console.log('Hardware cadastrado com sucesso!', hardwareCriado);
        this.successMessage = 'Hardware cadastrado com sucesso!';
        this.hardwares.push(hardwareCriado);
        this.imagemUrl = this.hardwareService.getImagemUrl(hardwareCriado.imagemUrl);
        this.resetForm();
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
      this.imagemAmpliada = imagemUrl.startsWith('http') ? imagemUrl : this.hardwareService.getImagemUrl(imagemUrl);
    } else {
      this.imagemAmpliada = 'assets/default-image.png';
    }

    console.log("Imagem final para exibição:", this.imagemAmpliada);
    this.modalImagemInstance.show();
  }

  habilitarEdicao(): void{
    this.modoEdicaoAtivado = true;
  }

  fecharImagemModal(): void {
    this.modalImagemInstance.hide();
    this.imagemAmpliada = null;
  }

  abrirModal(): void {
    this.resetForm();
    this.modalCreateInstance.show();
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

  cancelarEdicao(): void {
    this.hardwareForm.reset();
    this.imagemPreview = null;
    this.imagemArquivo = null;
    this.selectedFile = undefined;
    this.editandoHardwareId = null;
    this.modoEdicaoAtivado = false;

    if (this.modalEditInstance) {
      this.modalEditInstance.hide();
    }

    console.log('Edição cancelada');
  }

  verMais(hardwareId: number): void {
    this.editandoHardwareId = hardwareId;
    this.editarHardware(hardwareId);
  }

  resetForm(): void {
    this.hardwareForm.reset();
    this.imagemPreview = null;
    this.imagemArquivo = null;
    this.selectedFile = undefined;
  }
}
