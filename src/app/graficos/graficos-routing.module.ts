import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraficoEspecialidadesComponent } from './grafico-especialidades/grafico-especialidades.component';
import { GraficoDiasComponent } from './grafico-dias/grafico-dias.component';
import { GraficoTurnosPorMedicoComponent } from './grafico-turnos-por-medico/grafico-turnos-por-medico.component';
import { GraficoTurnosFinalizadosPorMedicoComponent } from './grafico-turnos-finalizados-por-medico/grafico-turnos-finalizados-por-medico.component';
import { GraficosComponent } from './graficos/graficos.component';

const routes: Routes = [
  { path: '', component: GraficosComponent },
  { path: 'especialidades', component: GraficoEspecialidadesComponent },
  { path: 'dias', component: GraficoDiasComponent },
  { path: 'turnos-por-medico', component: GraficoTurnosPorMedicoComponent },
  { path: 'turnos-finalizados-por-medico', component: GraficoTurnosFinalizadosPorMedicoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraficosRoutingModule { }
