import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';
import * as Chartist from 'chartist';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';


@Component({
  selector: 'app-grafico-turnos-por-medico',
  templateUrl: './grafico-turnos-por-medico.component.html',
  styleUrls: ['./grafico-turnos-por-medico.component.scss']
})
export class GraficoTurnosPorMedicoComponent implements OnInit {
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
      return turnoDate >= this.startDate && turnoDate <= this.endDate;
    });
    console.log(filteredTurnos)
    const turnosPorMedico = filteredTurnos.reduce((acc, turno) => {
      const medico = `${turno.especialista} (${turno.especialidad})`;
      if (!acc[medico]) {
        acc[medico] = 0;
      }
      acc[medico]++;
      return acc;
    }, {});

    this.turnosPorMedico = turnosPorMedico;
    this.descargarDisponible = true;
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
          style: 'stroke-width: 30px; stroke: green;'
        });
      }
    });
  }

  exportarAExcel(): void {
    const dataToExport = Object.keys(this.turnosPorMedico).map(key => ({
      Medico: key,
      Turnos: this.turnosPorMedico[key]
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Turnos Por Medico': worksheet }, SheetNames: ['Turnos Por Medico'] };
    XLSX.writeFile(workbook, 'Turnos_Por_Medico.xlsx');
  }


}
