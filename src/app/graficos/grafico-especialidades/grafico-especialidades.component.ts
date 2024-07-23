import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';
import * as Chartist from 'chartist';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grafico-especialidades',
  templateUrl: './grafico-especialidades.component.html',
  styleUrls: ['./grafico-especialidades.component.scss']
})
export class GraficoEspecialidadesComponent {
  @ViewChild('chart') chartElement!: ElementRef;
  legendLabels: string[] = [];
  data: any;

  constructor(private turnosService: TurnosService) { }

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    this.data = await this.turnosService.obtenerCantidadTurnosPorEspecialidad();
    const labels: string[] = Object.keys(this.data).map(especialidad => `${especialidad} (${this.data[especialidad]})`);
    const series: number[] = Object.values(this.data).map(value => Number(value));

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

  exportarAExcel(): void {
    const dataToExport = Object.keys(this.data).map(key => ({
      especialidad: key,
      Turnos: this.data[key]
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Turnos Por Especialidad': worksheet }, SheetNames: ['Turnos Por Especialidad'] };
    XLSX.writeFile(workbook, 'Turnos_Por_Especialidad.xlsx');
  }
}
