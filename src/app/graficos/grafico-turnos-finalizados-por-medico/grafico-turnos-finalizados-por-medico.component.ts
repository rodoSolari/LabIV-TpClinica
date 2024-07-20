import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';
import * as Chartist from 'chartist';
import { UsuarioService } from 'src/app/services/usuario.service';

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

    this.drawChart(turnosPorMedico);
  }

  drawChart(data: { [key: string]: number }) {
    const labels = Object.keys(data);
    const series = [Object.values(data)];

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
        left: 0
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

  }
}
