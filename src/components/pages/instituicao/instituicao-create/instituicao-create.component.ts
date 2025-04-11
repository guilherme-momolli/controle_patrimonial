import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InstituicaoService } from '../../../../core/services/instituicao/instituicao.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InstituicaoTipo, Pais, UF } from '../instituicao.enum';

@Component({
  selector: 'app-instituicao-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './instituicao-create.component.html',
  styleUrl: './instituicao-create.component.css'
})
export class InstituicaoCreateComponent implements OnInit {

  tipoInstituicoes = Object.values(InstituicaoTipo);
  paises = Object.values(Pais);
  ufs = Object.values(UF);

  instituicaoForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private instituicaoService: InstituicaoService,
    private router: Router
  ) {
    this.instituicaoForm = this.fb.group({
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefoneFixo: [''],
      telefoneCelular: [''],
      cnpj: [{ value: '', disabled: false }],
      tipoInstituicao: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      municipio: ['', Validators.required],
      uf: ['', Validators.required],
      pais: ['', Validators.required],
    });


    this.instituicaoForm.get('tipoInstituicao')?.valueChanges.subscribe(tipo => {
      const cnpjControl = this.instituicaoForm.get('cnpj');
      if (tipo === InstituicaoTipo.PUBLICA) {
        cnpjControl?.clearValidators();
        cnpjControl?.reset();
        cnpjControl?.disable();
      } else {
        cnpjControl?.setValidators([Validators.required]);
        cnpjControl?.enable();
      }
      cnpjControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  submitForm(): void {
    if (this.instituicaoForm.invalid) {
      this.instituicaoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const formValue = this.instituicaoForm.getRawValue();

    const senha = formValue.senha;
    delete formValue.senha;

    const instituicaoPayload = {
      razaoSocial: formValue.razaoSocial,
      nomeFantasia: formValue.nomeFantasia,
      email: formValue.email,
      telefoneFixo: formValue.telefoneFixo,
      telefoneCelular: formValue.telefoneCelular,
      cnpj: formValue.cnpj,
      tipoInstituicao: formValue.tipoInstituicao,
      endereco: {
        logradouro: formValue.logradouro,
        numero: formValue.numero,
        bairro: formValue.bairro,
        cep: formValue.cep,
        municipio: formValue.municipio,
        uf: formValue.uf,
        pais: formValue.pais
      }
    };

    this.instituicaoService.createInstituicao(formValue, senha).subscribe({
      next: () => {
        this.successMessage = 'Usuário cadastrado com sucesso!';
        this.instituicaoForm.reset();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Erro ao cadastrar usuário!';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
