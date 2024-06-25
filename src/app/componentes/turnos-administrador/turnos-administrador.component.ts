import { Component } from '@angular/core';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-turnos-administrador',
  templateUrl: './turnos-administrador.component.html',
  styleUrls: ['./turnos-administrador.component.scss']
})
export class TurnosAdministradorComponent {
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  especialidades: string[] = [];
  especialistas: string[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';
  selectedTurno: any;
  mostrarModalCancelar: boolean = false;

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos() {
   /*this.turnosService.traerTodosLosTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
      this.extraerEspecialidadesYEspecialistas();
    });*/
  }

  extraerEspecialidadesYEspecialistas() {
    const especialidadesSet = new Set<string>();
    const especialistasSet = new Set<string>();

    this.turnos.forEach(turno => {
      especialidadesSet.add(turno.especialidad);
      especialistasSet.add(turno.especialista);
    });

    this.especialidades = Array.from(especialidadesSet);
    this.especialistas = Array.from(especialistasSet);
  }

  filtrarTurnos() {
    this.turnosFiltrados = this.turnos.filter(turno => {
      return (this.filtroEspecialidad === '' || turno.especialidad === this.filtroEspecialidad) &&
             (this.filtroEspecialista === '' || turno.especialista === this.filtroEspecialista);
    });
  }

  abrirModalCancelar(turno: any) {
    this.selectedTurno = turno;
    this.mostrarModalCancelar = true;
  }

  cerrarModal(tipo: string) {
    if (tipo === 'cancelar') {
      this.mostrarModalCancelar = false;
    }
  }

  confirmarCancelarTurno() {
   /* if (this.selectedTurno && this.selectedTurno.id) {
      this.turnosService.cancelarTurno(this.selectedTurno.id).then(() => {
        this.cargarTurnos();
        this.cerrarModal('cancelar');
      }).catch((error) => {
        console.error('Error al cancelar el turno:', error);
      });
    } else {
      console.error('No se puede cancelar el turno: ID de turno no definido');
    }
  }*/
}
}
