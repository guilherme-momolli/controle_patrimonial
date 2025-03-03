import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AppComponent } from './app.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../core/services/auth/auth.guard';
import { MainComponent } from '../components/main/main.component';
import { UsuarioComponent } from '../components/usuario/usuario.component';
import { UsuarioEditComponent } from '../components/usuario-edit/usuario-edit.component';
import { FormsModule } from '@angular/forms';
import { TopNavbarComponent } from '../components/top-navbar/top-navbar.component';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'singup', component: UserFormComponent},
  { path: 'login', component: LoginComponent},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard]},
  { path: 'usuario_list', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'usuario_edit/:id', component: UsuarioEditComponent },
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    FormsModule,
    TopNavbarComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
