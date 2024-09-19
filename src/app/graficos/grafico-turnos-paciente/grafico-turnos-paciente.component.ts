import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { Firestore, collection, query, where, getDocs } from 'firebase/firestore';
import { BaseChartDirective } from 'ng2-charts';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-grafico-turnos-paciente',
  templateUrl: './grafico-turnos-paciente.component.html',
  styleUrls: ['./grafico-turnos-paciente.component.scss']
})
export class GraficoTurnosPacienteComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public pacientes: any[] = [];
  public pacienteSeleccionado: any = null;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'black',
          font: {
            size: 18,
            weight: 'bold'
          },
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        ticks: {
          color: 'black',
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Turnos',
          color: 'black',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display:false
        /*position: 'top',
        labels: {
          color: 'black'
        }*/
      }
    }
  };

  public barChartLabels: string[] = ['Pendientes', 'Cancelados', 'Finalizados'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartDataset<'bar'>[] = [
    {
      data: [0, 0, 0],
      label: 'Turnos por Estado',
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }
  ];

  constructor(private turnosService: TurnosService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.obtenerPacientes();
  }

  obtenerPacientes(): void {
    this.usuarioService.traerPacientes().subscribe((pacientes: any[]) => {
      this.pacientes = pacientes;
    });
  }

  cargarTurnosPaciente(): void {
    if (!this.pacienteSeleccionado) return;

    this.turnosService.traerTurnosPorPaciente(this.pacienteSeleccionado.email).subscribe(turnos => {

      const turnosPendientes = turnos.filter(turno => turno.estado === 'pendiente').length;
      const turnosCancelados = turnos.filter(turno => turno.estado === 'cancelado').length;
      const turnosFinalizados = turnos.filter(turno => turno.estado === 'realizado').length;

      this.barChartData[0].data = [turnosPendientes, turnosCancelados, turnosFinalizados];

      this.chart?.update();
    });
  }
}
