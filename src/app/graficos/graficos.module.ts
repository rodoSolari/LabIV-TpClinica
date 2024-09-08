import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraficoEspecialidadesComponent } from './grafico-especialidades/grafico-especialidades.component';
import { GraficoDiasComponent } from './grafico-dias/grafico-dias.component';
import { GraficoTurnosPorMedicoComponent } from './grafico-turnos-por-medico/grafico-turnos-por-medico.component';
import { GraficoTurnosFinalizadosPorMedicoComponent } from './grafico-turnos-finalizados-por-medico/grafico-turnos-finalizados-por-medico.component';
import { FormsModule } from '@angular/forms';
import { GraficosRoutingModule } from './graficos-routing.module';
import { GraficosComponent } from './graficos/graficos.component';
import { TranslateModule } from '@ngx-translate/core';
import { GraficoVisitasClinicaComponent } from './grafico-visitas-clinica/grafico-visitas-clinica.component';



@NgModule({
  declarations: [
    GraficoEspecialidadesComponent,
    GraficoDiasComponent,
    GraficoTurnosPorMedicoComponent,
    GraficoTurnosFinalizadosPorMedicoComponent,
    GraficosComponent,
    GraficoVisitasClinicaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GraficosRoutingModule,
    TranslateModule
  ],
  exports: [
    GraficoEspecialidadesComponent,
    GraficoDiasComponent,
    GraficoTurnosPorMedicoComponent,
    GraficoTurnosFinalizadosPorMedicoComponent
  ]
})
export class GraficosModule { }
