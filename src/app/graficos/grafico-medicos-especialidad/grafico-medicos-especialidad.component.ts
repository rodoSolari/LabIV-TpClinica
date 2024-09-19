import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { UsuarioService } from 'src/app/services/usuario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-grafico-medicos-especialidad',
  templateUrl: './grafico-medicos-especialidad.component.html',
  styleUrls: ['./grafico-medicos-especialidad.component.scss']
})
export class GraficoMedicosEspecialidadComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display:false
        /*position: 'top',
        labels: {
          color: 'black'
        }*/
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'black',
          font: {
            size: 16
          }
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
            size: 16
          }
        },
        title: {
          display: true,
          text: 'Cantidad de medicos',
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
    },
    elements: {
      bar: {
        borderWidth: 2
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar'>[] = [
    { data: [],
      label: 'Cantidad de Médicos por Especialidad',
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)', // Color de las barras
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)' // Color del borde de las barras
      ],
      borderWidth: 2 // Ancho del borde
     }
  ];

  constructor(private usuariosService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarMedicosPorEspecialidad();
  }

  async cargarMedicosPorEspecialidad() {
    const medicos = await this.usuariosService.obtenerMedicosPorEspecialidad();
    const medicosPorEspecialidad = this.agruparMedicosPorEspecialidad(medicos);
    this.actualizarGrafico(medicosPorEspecialidad);
  }

  // Modificar la función para contar ambas especialidades
  agruparMedicosPorEspecialidad(medicos: any[]): { [key: string]: number } {
    const medicosPorEspecialidad: { [key: string]: number } = {};

    medicos.forEach(medico => {
      const especialidad1 = medico['especialidad'];
      const especialidad2 = medico['especialidad2'];

      // Contar la primera especialidad
      if (especialidad1) {
        if (medicosPorEspecialidad[especialidad1]) {
          medicosPorEspecialidad[especialidad1]++;
        } else {
          medicosPorEspecialidad[especialidad1] = 1;
        }
      }

      // Contar la segunda especialidad, si existe
      if (especialidad2) {
        if (medicosPorEspecialidad[especialidad2]) {
          medicosPorEspecialidad[especialidad2]++;
        } else {
          medicosPorEspecialidad[especialidad2] = 1;
        }
      }
    });

    return medicosPorEspecialidad;
  }

  actualizarGrafico(medicosPorEspecialidad: { [key: string]: number }) {
    this.barChartLabels = Object.keys(medicosPorEspecialidad);
    this.barChartData[0].data = Object.values(medicosPorEspecialidad);
  }

  descargarPDF(): void {
    const DATA = document.getElementById('grafico-medicos-especialidad') as HTMLElement;
    html2canvas(DATA).then(canvas => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const fileURI = canvas.toDataURL('image/png');

      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(fileURI, 'PNG', 0, 10, fileWidth, fileHeight);
      PDF.save('grafico-medicos-por-especialidad.pdf');
    });
  }
}
