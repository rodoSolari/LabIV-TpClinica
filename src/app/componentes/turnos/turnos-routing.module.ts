import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnosAdministradorComponent } from './turnos-administrador/turnos-administrador.component';
import { MisTurnosEspecialistaComponent } from './mis-turnos-especialista/mis-turnos-especialista.component';
import { MisTurnosPacienteComponent } from './mis-turnos-paciente/mis-turnos-paciente.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';



const routes: Routes = [
  { path: 'turnos-administrador', component: TurnosAdministradorComponent},
  { path: 'mis-turnos-paciente', component: MisTurnosPacienteComponent},
  { path: 'mis-turnos-especialista', component: MisTurnosEspecialistaComponent},
  { path: 'solicitar-turno', component: SolicitarTurnoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
