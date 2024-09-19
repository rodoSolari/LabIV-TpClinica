import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { EncuestaService } from 'src/app/services/encuesta.service';


@Component({
  selector: 'app-grafico-encuesta',
  templateUrl: './grafico-encuesta.component.html',
  styleUrls: ['./grafico-encuesta.component.scss']
})
export class GraficoEncuestaComponent implements OnInit{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'black',
          font: {
            size: 17,
            weight: 'bold'
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7
        }
      },
      y: {
        ticks: {
          color: 'black',
          stepSize: 1
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

  public barChartLabels: string[] = [
    'Calificación Promedio',
    'Satisfacción (Muy Bueno)',
    'Satisfacción (Bueno)',
    'Satisfacción (Regular)',
    'Satisfacción (Malo)',
    'Puntualidad',
    'Empatía'
  ];

  public barChartType: ChartType = 'bar';
  public barChartData: ChartDataset<'bar'>[] = [
    {
      data: [],
      label: 'Respuestas de Encuesta',
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }
  ];

  constructor(private encuestasService: EncuestaService) {}

  ngOnInit(): void {
    this.cargarDatosEncuesta();
  }

  async cargarDatosEncuesta() {
    const encuestas = await this.encuestasService.obtenerEncuestas();

    const calificacionPromedio = this.calcularPromedioCalificacion(encuestas);
    const respuestasSatisfaccion = this.agruparSatisfaccion(encuestas);
    const puntualidad = this.contarAspecto(encuestas, 'puntualidad');
    const empatia = this.contarAspecto(encuestas, 'empatia');


    this.barChartData[0].data = [
      calificacionPromedio,
      respuestasSatisfaccion['muy_bueno'],
      respuestasSatisfaccion['bueno'],
      respuestasSatisfaccion['regular'],
      respuestasSatisfaccion['malo'],
      puntualidad,
      empatia
    ];

    this.chart?.update();
  }

  calcularPromedioCalificacion(encuestas: any[]): number {
    let total = 0;
    encuestas.forEach(encuesta => {
      total += encuesta['calificacion'];
    });
    return total / encuestas.length;
  }

  agruparSatisfaccion(encuestas: any[]): { [key: string]: number } {
    const respuestas: { muy_bueno: number; bueno: number; regular: number; malo: number } = {
      muy_bueno: 0,
      bueno: 0,
      regular: 0,
      malo: 0
    };

    encuestas.forEach(encuesta => {
      const satisfaccion: 'muy_bueno' | 'bueno' | 'regular' | 'malo' = encuesta['satisfaccion']['respuesta'];

      if (respuestas[satisfaccion] !== undefined) {
        respuestas[satisfaccion]++;
      }
    });

    return respuestas;
  }

  contarAspecto(encuestas: any[], aspecto: string): number {
    let count = 0;
    encuestas.forEach(encuesta => {
      if (encuesta[aspecto] === true) {
        count++;
      }
    });
    return count;
  }
}
