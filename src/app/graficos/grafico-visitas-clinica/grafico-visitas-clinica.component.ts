import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import * as moment from 'moment';
import { TurnosService } from 'src/app/services/turnos.service';


@Component({
  selector: 'app-grafico-visitas-clinica',
  templateUrl: './grafico-visitas-clinica.component.html',
  styleUrls: ['./grafico-visitas-clinica.component.scss']
})
export class GraficoVisitasClinicaComponent  implements OnInit {
  public lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display:false
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Para mostrar todas las etiquetas
          maxTicksLimit: 12,
          color: 'black',
          font: {
            size: 16
          },
          maxRotation: 0,
          minRotation: 0
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          color: 'black',
          stepSize: 1,
          font: {
            size: 14
          }
        },
        title: {
          display: true,
          text: 'Cantidad de visitas',
          color: 'black',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }


  };



  public lineChartType: ChartType = 'bar';
  public lineChartLabels: string[] = [];
  public lineChartLegend = true;
  public lineChartData: ChartDataset<'line'>[] = [
    { data: [], label: 'Cantidad de visitas a la clinica' }
  ];

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.cargarVisitas();
  }

  async cargarVisitas() {
    const turnos = await this.turnosService.obtenerTurnosUltimos30Dias();
    const visitasPorDia = this.filtrarTurnosRealizadosYAgrupar(turnos);
    this.actualizarGrafico(visitasPorDia);
  }

  // Filtrar turnos con estado "realizado" y agruparlos por día
  filtrarTurnosRealizadosYAgrupar(turnos: any[]): { [key: string]: number } {
    const visitasPorDia: { [key: string]: number } = {};

    turnos.forEach(turno => {
      if (turno['estado'] === 'realizado') {
        const dia = moment(turno['dia'], 'YYYY-MM-DD').format('YYYY-MM-DD');
        if (visitasPorDia[dia]) {
          visitasPorDia[dia]++;
        } else {
          visitasPorDia[dia] = 1;
        }
      }
    });

    return visitasPorDia;
  }

  actualizarGrafico(visitasPorDia: { [key: string]: number }) {
    this.lineChartLabels = Object.keys(visitasPorDia);
    this.lineChartData[0].data = Object.values(visitasPorDia);
  }

}
