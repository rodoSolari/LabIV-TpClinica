import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';
import * as Chartist from 'chartist';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grafico-dias',
  templateUrl: './grafico-dias.component.html',
  styleUrls: ['./grafico-dias.component.scss']
})
export class GraficoDiasComponent {
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
    this.data = await this.turnosService.obtenerCantidadTurnosPorDia();

    const labels: string[] = Object.keys(this.data).sort(); // Ordenar los días
    const series: number[] = Object.values(this.data).map(value => Number(value));

    this.legendLabels = labels;

    console.log('Labels (dias):', labels);
    console.log('Series (dias):', series);

    if (labels.length > 0 && series.length > 0) {
      const chartData = {
        labels: labels,
        series: [series]
      };

      const options = {
        axisX: {
          showGrid: false
        },
        axisY: {
          onlyInteger: true
        },
        height: '500px',
        width: '1000px',
        chartPadding: {
          right: 40
        },
        seriesBarDistance: 20
      };

      const chart = new Chartist.BarChart(this.chartElement.nativeElement, chartData, options);

      chart.on('draw', function(data) {
        if (data.type === 'bar') {
          data.element.attr({
            style: 'stroke-width: 30px; stroke: blue;' // Ajustar el grosor y color de las barras
          });
        }
      });
    } else {
      console.log('No hay datos suficientes para mostrar el gráfico de días');
    }
  }

  exportarAExcel(): void {
    const dataToExport = Object.keys(this.data).map(key => ({
      Fecha: key,
      Turnos: this.data[key]
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Turnos Por Día': worksheet }, SheetNames: ['Turnos Por Día'] };
    XLSX.writeFile(workbook, 'Turnos_Por_Dia.xlsx');
  }
}
