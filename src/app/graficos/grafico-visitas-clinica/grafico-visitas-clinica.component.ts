import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { UsuarioService } from 'src/app/services/usuario.service';  // Suponiendo que tienes un servicio para obtener visitas
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grafico-visitas-clinica',
  templateUrl: './grafico-visitas-clinica.component.html',
  styleUrls: ['./grafico-visitas-clinica.component.scss']
})
export class GraficoVisitasClinicaComponent {
  @ViewChild('chart') chartElement!: ElementRef;
  visitas: any[] = [];
  descargarDisponible: boolean = false;

  constructor(private visitasService: UsuarioService) { }

  ngOnInit(): void {
    this.visitasService.obtenerVisitas().subscribe(visitas => {
      this.visitas = visitas;
      this.drawChart(this.visitas);
    });
  }

  drawChart(visitas: any[]): void {
    const visitasPorDia = visitas.reduce((acc, visita) => {
      const dia = new Date(visita.fecha).toLocaleDateString();
      if (!acc[dia]) {
        acc[dia] = 0;
      }
      acc[dia]++;
      return acc;
    }, {} as { [key: string]: number });

    const labels = Object.keys(visitasPorDia);
    const series: number[][] = [Object.values(visitasPorDia)];

    const chartData = {
      labels: labels,
      series: series
    };

    const options = {
      axisX: {
        showGrid: true
      },
      axisY: {
        onlyInteger: true
      },
      height: '500px',
      width: '1000px',
      chartPadding: {
        right: 40,
        left: 20
      },
      seriesBarDistance: 20
    };

    const chart = new Chartist.BarChart(this.chartElement.nativeElement, chartData, options);

    chart.on('draw', function(data) {
      if (data.type === 'bar') {
        data.element.attr({
          style: 'stroke-width: 50px; stroke: blue;'
        });
      }
    });

    chart.on('created', (data: any) => {
      const yAxisLabel = new Chartist.Svg('text');
      yAxisLabel.text('Cantidad de Visitas');
      yAxisLabel.addClass('ct-label');
      yAxisLabel.attr({
        x: data.chartRect.x1 - 30,
        y: data.chartRect.y1 - (data.chartRect.height() / 2),
        'text-anchor': 'middle',
        'font-size': '14px',
        'font-weight': 'bold',
        'fill': '#000',
        'transform': `rotate(-90, ${data.chartRect.x1 - 30}, ${data.chartRect.y1 - (data.chartRect.height() / 2)})`
      });

      data.svg.append(yAxisLabel);
    });
  }

  exportarAExcel(): void {
    const dataToExport = this.visitas.map(visita => ({
      Fecha: new Date(visita.fecha).toLocaleDateString(),
      Visitas: visita.cantidad
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Visitas Clinica': worksheet }, SheetNames: ['Visitas Clinica'] };
    XLSX.writeFile(workbook, 'Visitas_Clinica.xlsx');
  }
}
