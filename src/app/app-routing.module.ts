import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { SolicitarTurnoComponent } from './componentes/turnos/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';
import { PacientesComponent } from './componentes/pacientes/pacientes.component';
import { EstadisticasAdminComponent } from './componentes/estadisticas-admin/estadisticas-admin.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'turnos', loadChildren: () => import('./componentes/turnos/turnos.module').then(m => m.TurnosModule) },
  { path: 'mi-perfil', component: MiPerfilComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'estadisticas-admin', component: EstadisticasAdminComponent },
  { path: 'graficos', loadChildren: () => import('./graficos/graficos.module').then(m => m.GraficosModule) },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
