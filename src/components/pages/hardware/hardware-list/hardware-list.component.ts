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
  }

  gerarRelatorio(): void {
    this.relatorioService.gerearRelatorioHardware(this.hardwares);
  }

  carregarHardwares(): void {
    this.hardwareService.getHardwares().subscribe({
      next: (data) => {
        this.hardwares = data.map(hardware => ({
          ...hardware,
          imagemUrl: 'assets/default-image.png' // Definir um padrão enquanto carregamos as imagens
        }));
  
        // Para cada hardware, buscar a URL da imagem
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

    this.hardwareService.updateHardware(id, this.hardwareForm.value)
      .subscribe({
        next: (hardwareAtualizado) => {
          console.log('Hardware atualizado com sucesso', hardwareAtualizado);
          this.carregarHardwares();
        },
        error: (erro) => {
          console.error('Erro ao atualizar hardware:', erro);
        },
        complete: () => {
          this.isSubmitting = false;
          this.modalEditInstance.hide();
        }
      });
    this.hardwareForm.reset();
  }

  abrirModal(): void {
    this.hardwareForm.reset();
    this.imagemPreview = null;
    this.imagemArquivo = null;
    this.modalCreateInstance.show();
  }

  fecharModal(): void {
    this.hardwareForm.reset();
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
          this.fecharModal();
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
  
    // Usa `this.imagemArquivo` para garantir que a imagem está sendo enviada corretamente
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
        this.fecharModal();
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
}
