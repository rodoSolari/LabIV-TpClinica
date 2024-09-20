import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-grafico-visitas-logs',
  templateUrl: './grafico-visitas-logs.component.html',
  styleUrls: ['./grafico-visitas-logs.component.scss']
})
export class GraficoVisitasLogsComponent implements OnInit {
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'black'
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: 'black',
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'Cantidad de visitas logs',
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
        display: false
      }
    }
  };

  public lineChartLabels: string[] = [];
  public lineChartData: ChartDataset<'line'>[] = [
    {
      data: [],
      label: 'Logs en los últimos 30 días',
      fill: false,
      borderColor: 'rgba(0, 255, 0, 1)',  // Cambiar la línea a verde
      backgroundColor: 'rgba',
      tension: 0.1
    }
  ];

  public lineChartType: ChartType = 'line';

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.cargarLogsUltimos30Dias();
  }

  // Generar las últimas 30 fechas (independientemente de si hay logs)
  generarUltimos30Dias(): string[] {
    const fechas: string[] = [];
    for (let i = 0; i < 30; i++) {
      const dia = moment().subtract(i, 'days').format('YYYY-MM-DD');
      fechas.unshift(dia);
    }
    return fechas;
  }

  async cargarLogsUltimos30Dias() {
    const logs = await this.logService.obtenerLogsUltimos30Dias();
    const logsPorDia = this.agruparLogsPorDia(logs);


    const dias = this.generarUltimos30Dias();
    const datosFinales = dias.map(dia => logsPorDia[dia] || 0);

    this.actualizarGrafico(dias, datosFinales);
  }

  agruparLogsPorDia(logs: any[]): { [key: string]: number } {
    const logsPorDia: { [key: string]: number } = {};

    logs.forEach(log => {
      const dia = moment(log.fechaHora).format('YYYY-MM-DD');
      if (logsPorDia[dia]) {
        logsPorDia[dia]++;
      } else {
        logsPorDia[dia] = 1;
      }
    });

    return logsPorDia;
  }

  actualizarGrafico(fechas: string[], datos: number[]) {
    this.lineChartLabels = fechas;
    this.lineChartData[0].data = datos;
  }
}
