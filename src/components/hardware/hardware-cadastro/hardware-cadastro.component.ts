import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HardwareService } from '../../../core/services/hardware/hardware.service';
import { Componente, Estatus } from './hardware.enum';

@Component({
  selector: 'app-hardware-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hardware-cadastro.component.html',
  styleUrl: './hardware-cadastro.component.css',
})

export class HardwareCadastroComponent {
  hardwareForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;
  imagemInvalida = false;

  componentes = Object.values(Componente);
  estatusList = Object.values(Estatus);

  constructor(private fb: FormBuilder, private hardwareService: HardwareService, private router: Router) {
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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }  

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      if (!file.type.startsWith('image/')) {
        this.imagemInvalida = true;
        this.imagemPreview = null;
        this.errorMessage = 'Apenas imagens são permitidas!';
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) {
        this.imagemInvalida = true;
        this.imagemPreview = null;
        this.errorMessage = 'Imagem muito grande! Tamanho máximo: 5MB.';
        return;
      }
  
      this.imagemInvalida = false;
      this.imagemArquivo = file;
      this.errorMessage = null;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm(event: Event) {

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
      next: () => {
        this.successMessage = 'Hardware cadastrado com sucesso!';
        this.hardwareForm.reset();
        this.imagemPreview = null;
        this.imagemArquivo = null;
  
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
