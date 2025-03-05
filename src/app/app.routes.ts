import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../core/services/auth/auth.guard';
import { MainComponent } from '../components/main/main.component';
import { UsuarioComponent } from '../components/usuario/usuario/usuario.component';
import { UsuarioEditComponent } from '../components/usuario/usuario-edit/usuario-edit.component';
import { FormsModule } from '@angular/forms';
import { TopNavbarComponent } from '../components/top-navbar/top-navbar.component';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';
import { HardwareComponent } from '../components/hardware/hardware/hardware.component';
import { HardwareEditComponent } from '../components/hardware/hardware-edit/hardware-edit.component';
import { UsuarioCadastroComponent } from '../components/usuario/usuario-cadastro/usuario-cadastro.component';
import { HardwareCadastroComponent } from '../components/hardware/hardware-cadastro/hardware-cadastro.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { HardwarePatrimonialComponent } from '../components/hardware/hardware-patrimonial/hardware-patrimonial.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'singup', component: UsuarioCadastroComponent},
  { path: 'login', component: LoginComponent},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  { path: 'usuario_list', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuario_edit/:id', component: UsuarioEditComponent },
  { path: 'hardware_list', component: HardwareComponent},
  { path: 'hardware_create', component: HardwareCadastroComponent},
  { path: 'hardware_edit/:id', component: HardwareEditComponent},
  { path: 'patrimonio_list', component: HardwarePatrimonialComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    FormsModule,
    TopNavbarComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
