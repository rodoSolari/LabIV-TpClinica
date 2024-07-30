import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';
import * as Chartist from 'chartist';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-grafico-turnos-finalizados-por-medico',
  templateUrl: './grafico-turnos-finalizados-por-medico.component.html',
  styleUrls: ['./grafico-turnos-finalizados-por-medico.component.scss']
})
export class GraficoTurnosFinalizadosPorMedicoComponent {
  @ViewChild('chart') chartElement!: ElementRef;
  especialistas: any[] = [];
  turnos: any[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  turnosPorMedico: { [key: string]: number } = {};
  descargarDisponible : boolean = false;

  constructor(
    private turnosService: TurnosService,
    private usuariosService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuariosService.traerEspecialistas().subscribe(especialistas => {
      this.especialistas = especialistas;
    });

    this.turnosService.obtenerTurnos().subscribe(turnos => {
      this.turnos = turnos;
    });
  }

  filterTurnosByDateRange() {
    const filteredTurnos = this.turnos.filter(turno => {
      const turnoDate = turno.dia;
      return turno.estado === 'realizado' && turnoDate >= this.startDate && turnoDate <= this.endDate;
    });

    const turnosPorMedico = filteredTurnos.reduce((acc, turno) => {
      const medico = `${turno.especialista} (${turno.especialidad})`;
      if (!acc[medico]) {
        acc[medico] = 0;
      }
      acc[medico]++;
      return acc;
    }, {});
    this.descargarDisponible = true;
    this.turnosPorMedico = turnosPorMedico;
    this.drawChart(turnosPorMedico);
  }

  drawChart(data: { [key: string]: number }) {
    const labels = Object.keys(data);
    const series = [Object.values(data)];
    if (labels.length > 0 && series.length > 0) {
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
      yAxisLabel.text('Cantidad de turnos');
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

    } else {
      console.log('No hay datos suficientes para mostrar el gráfico de días');
    }

  }


  exportarAExcel(): void {
    const dataToExport = Object.keys(this.turnosPorMedico).map(key => ({
      Medico: key,
      Turnos: this.turnosPorMedico[key]
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Turnos Finalizados Por Medico': worksheet }, SheetNames: ['Turnos Finalizados Por Medico'] };
    XLSX.writeFile(workbook, 'Turnos_Finalizados_Por_Medico.xlsx');
  }
}
