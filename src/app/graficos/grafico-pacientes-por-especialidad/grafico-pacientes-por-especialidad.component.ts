import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BaseChartDirective } from 'ng2-charts';
import { TurnosService } from 'src/app/services/turnos.service';


@Component({
  selector: 'app-grafico-pacientes-por-especialidad',
  templateUrl: './grafico-pacientes-por-especialidad.component.html',
  styleUrls: ['./grafico-pacientes-por-especialidad.component.scss']
})
export class GraficoPacientesPorEspecialidadComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartOptions: ChartOptions = {
    backgroundColor:"rgba(255, 255, 255)",
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
            size: 20,
            weight: 'bold'
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
            size: 18
          }
        },
        title: {
          display: true,
          text: 'Cantidad de Pacientes',
          color: 'black',
          font: {
            size: 18,
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
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartLegend = true;
  public barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Cantidad de pacientes por especialidad' }
  ];

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.cargarPacientesPorEspecialidad();
  }

  async cargarPacientesPorEspecialidad() {
    const turnos = await this.turnosService.obtenerTurnosUltimos30Dias();
    const pacientesPorEspecialidad = this.filtrarTurnosYAgruparPorEspecialidad(turnos);
    this.actualizarGrafico(pacientesPorEspecialidad);
  }

  filtrarTurnosYAgruparPorEspecialidad(turnos: any[]): { [key: string]: number } {
    const especialidadesPorPaciente: { [especialidad: string]: Set<string> } = {};

    turnos.forEach(turno => {
      if (turno['estado'] === 'pendiente' || turno['estado'] === 'realizado') {
        const especialidad = turno['especialidad'];
        const pacienteEmail = turno['pacienteEmail'];

        if (!especialidadesPorPaciente[especialidad]) {
          especialidadesPorPaciente[especialidad] = new Set();
        }


        especialidadesPorPaciente[especialidad].add(pacienteEmail);
      }
    });

    const cantidadPorEspecialidad: { [key: string]: number } = {};
    Object.keys(especialidadesPorPaciente).forEach(especialidad => {
      cantidadPorEspecialidad[especialidad] = especialidadesPorPaciente[especialidad].size;
    });

    return cantidadPorEspecialidad;
  }

  actualizarGrafico(pacientesPorEspecialidad: { [key: string]: number }) {
    this.barChartLabels = Object.keys(pacientesPorEspecialidad);
    this.barChartData[0].data = Object.values(pacientesPorEspecialidad);
    this.chart?.update();
  }

  descargarPDF(): void {
    const DATA = document.getElementById('grafico-pacientes-especialidad') as HTMLElement;
    html2canvas(DATA).then(canvas => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const fileURI = canvas.toDataURL('image/png');

      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(fileURI, 'PNG', 0, 10, fileWidth, fileHeight);
      PDF.save('grafico-pacientes-especialidad.pdf');
    });
  }

}
