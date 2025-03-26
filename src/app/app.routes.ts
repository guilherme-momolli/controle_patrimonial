import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/pages/login/login.component';
import { AuthGuard } from '../core/services/auth/auth.guard';
import { MainComponent } from '../components/pages/main/main.component';
import { UsuarioComponent } from '../components/pages/usuario/usuario/usuario.component';
import { UsuarioEditComponent } from '../components/pages/usuario/usuario-edit/usuario-edit.component';
import { FormsModule } from '@angular/forms';
import { LandingPageComponent } from '../components/pages/landing-page/landing-page.component';
import { UsuarioCadastroComponent } from '../components/pages/usuario/usuario-cadastro/usuario-cadastro.component';
import { NotFoundComponent } from '../components/pages/not-found/not-found.component';
import { PatrimonioListComponent } from '../components/pages/patrimonio/patrimonio-list/patrimonio-list.component';
import { HardwareListComponent } from '../components/pages/hardware/hardware-list/hardware-list.component';
import { ContatoComponent } from '../components/pages/contato/contato.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'singup', component: UsuarioCadastroComponent},
  { path: 'login', component: LoginComponent},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  { path: 'usuario_list', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuario_edit/:id', component: UsuarioEditComponent, canActivate:[AuthGuard]},
  { path: 'hardware_list', component: HardwareListComponent, canActivate:[AuthGuard]},
  { path: 'patrimonio_list', component: PatrimonioListComponent, canActivate:[AuthGuard]},
  { path: 'contato', component: ContatoComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    FormsModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
