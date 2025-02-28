import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../features/home/home.component';
import { AppComponent } from './app.component';
import { UserFormComponent } from '../features/user-form/user-form.component';
import { LoginComponent } from '../features/login/login.component';
import { AuthGuard } from '../core/services/auth/auth.guard';
import { MainComponent } from '../features/main/main.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'singup', component: UserFormComponent},
  { path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate: [AuthGuard]}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
