import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';
import { HardwareService } from '../../../core/services/hardware/hardware.service';
import { Componente, Estatus } from './hardware.enum';

@Component({
  selector: 'app-hardware-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './hardware-cadastro.component.html',
  styleUrl: './hardware-cadastro.component.css'
})
export class HardwareCadastroComponent {
  hardwareForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

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
      precoTotal: ['', Validators.required],
      estatus: ['', Validators.required]
      // dataFabricacao: ['', Validators.required],
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
    
  submitForm() {
    if (this.hardwareForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.hardwareService.createHardware(this.hardwareForm.value).subscribe({
      next: () => {
        this.successMessage = 'Usuário cadastrado com sucesso!';
        this.hardwareForm.reset();
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
