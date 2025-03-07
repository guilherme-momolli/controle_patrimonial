import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HardwareService } from '../../../core/services/hardware/hardware.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Componente, Estatus } from '../hardware-cadastro/hardware.enum';

@Component({
  selector: 'app-hardware-edit',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule,FormsModule, RouterModule],
  templateUrl: './hardware-edit.component.html',
  styleUrl: './hardware-edit.component.css'
})
export class HardwareEditComponent implements OnInit{
  hardware: any = { id: null, controlePatrimonial: '', componente: '', numeroSerial: '', modelo: '', fabricante: '', velocidade:'', precototal:'', estatus:''};

   componentes = Object.values(Componente);
    estatusList = Object.values(Estatus);
    constructor(
        private route: ActivatedRoute,
        private hardwareService: HardwareService,
        public router: Router
      ) {}
    
      ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.carregarHardware(parseInt(id));
        }
      }
    
      carregarHardware(id: number): void {
        this.hardwareService.getHardwareById(id).subscribe(
          (data) => {
            this.hardware = data;
          },
          (error) => {
            console.error('Erro ao carregar usuário', error);
          }
        );
      }
    
      salvarEdicao(): void {
        this.hardwareService.updateHardware(this.hardware).subscribe(
          () => {
            alert('Hardware atualizado com sucesso!');
            this.router.navigate(['/hardware_list']);
          },
          (error) => {
            console.error('Erro ao atualizar usuário', error);
          }
        );
      }

}
