import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TurnosAdministradorComponent } from './turnos-administrador/turnos-administrador.component';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { MisTurnosPacienteComponent } from './mis-turnos-paciente/mis-turnos-paciente.component';
import { MisTurnosEspecialistaComponent } from './mis-turnos-especialista/mis-turnos-especialista.component';
import { FormatTimePipe } from 'src/app/Pipes/format-time.pipe';
import { TurnosRoutingModule } from './turnos-routing.module';
import { ButtonStyleDirective } from 'src/app/directivas/button-style.directive';



@NgModule({
  declarations: [
    TurnosAdministradorComponent,
    SolicitarTurnoComponent,
    MisTurnosPacienteComponent,
    MisTurnosEspecialistaComponent,
    FormatTimePipe,
    ButtonStyleDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TurnosRoutingModule
  ],
  exports: [
    TurnosAdministradorComponent,
    SolicitarTurnoComponent,
    MisTurnosPacienteComponent,
    MisTurnosEspecialistaComponent
  ]
})
export class TurnosModule { }
