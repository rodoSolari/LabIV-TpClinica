import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';

import * as Chartist from 'chartist';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-grafico-turnos-por-medico',
  templateUrl: './grafico-turnos-por-medico.component.html',
  styleUrls: ['./grafico-turnos-por-medico.component.scss']
})
export class GraficoTurnosPorMedicoComponent {
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
      const turnoDate = new Date(turno.fecha);
      return turnoDate >= this.startDate && turnoDate <= this.endDate;
    });

    const turnosPorMedico = filteredTurnos.reduce((acc, turno) => {
      const medico = turno.especialista;
      if (!acc[medico]) {
        acc[medico] = 0;
      }
      acc[medico]++;
      return acc;
    }, {});

    this.drawChart(turnosPorMedico);
  }

  drawChart(data: any) {
    const labels = Object.keys(data);
    const series = Object.values(data);

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
      height: '400px',
      width: '600px',
      chartPadding: {
        right: 40
      },
      seriesBarDistance: 15
    };

   // new Chartist.Bar(this.chartElement.nativeElement, chartData, options);
  }
}
