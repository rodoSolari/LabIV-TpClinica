import { Component } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-graficos-admin',
  templateUrl: './graficos-admin.component.html',
  styleUrls: ['./graficos-admin.component.scss']
})
export class GraficosAdminComponent {
  dataTurnosPorEspecialidad: { labels: string[], series: number[] } = {
    labels: [],
    series: []
  };
  typePie: string = 'Pie';
  optionsPie: any = {
    donut: true,
    showLabel: true
  };

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.cargarDatosTurnosPorEspecialidad();
  }

  async cargarDatosTurnosPorEspecialidad() {
    const cantidadPorEspecialidad = await this.turnosService.obtenerCantidadTurnosPorEspecialidad();
    this.dataTurnosPorEspecialidad.labels = Object.keys(cantidadPorEspecialidad);
    this.dataTurnosPorEspecialidad.series = Object.values(cantidadPorEspecialidad);
  }
}
