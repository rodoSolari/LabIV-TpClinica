import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { AuthGuard } from './auth.guard';
import { MisTurnosPacienteComponent } from './componentes/mis-turnos-paciente/mis-turnos-paciente.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { MisTurnosEspecialistaComponent } from './componentes/mis-turnos-especialista/mis-turnos-especialista.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'solicitar-turno', component: SolicitarTurnoComponent },
  { path: 'mis-turnos-paciente', component: MisTurnosPacienteComponent },
  { path: 'mis-turnos-especialista', component: MisTurnosEspecialistaComponent },
  { path: 'mi-perfil', component: MiPerfilComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
