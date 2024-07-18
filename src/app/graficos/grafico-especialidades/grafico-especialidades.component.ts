import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-grafico-especialidades',
  templateUrl: './grafico-especialidades.component.html',
  styleUrls: ['./grafico-especialidades.component.scss']
})
export class GraficoEspecialidadesComponent {
  @ViewChild('chart') chartElement!: ElementRef;
  legendLabels: string[] = [];

  constructor(private turnosService: TurnosService) { }

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    const data = await this.turnosService.obtenerCantidadTurnosPorEspecialidad();
    const labels: string[] = Object.keys(data).map(especialidad => `${especialidad} (${data[especialidad]})`);
    const series: number[] = Object.values(data).map(value => Number(value));

    if (labels.length > 0 && series.length > 0) {
      const chartData = {
        labels: labels,
        series: series
      };

      const options = {
        donut: false,
        showLabel: true,
      };

      new Chartist.PieChart(this.chartElement.nativeElement, chartData, options);

    } else {
      console.log('No hay datos suficientes para mostrar el gráfico');
    }
  }
}
