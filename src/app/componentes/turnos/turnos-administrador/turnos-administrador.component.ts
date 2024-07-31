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
  especialidadSeleccionada: string | null = null;
  especialistaSeleccionado: string | null = null;
  modalVisible: boolean = false;
  turnoSeleccionado: any = null;
  comentarioCancelacion: string = '';

  constructor(private turnosService: TurnosService) { }

  ngOnInit(): void {
    this.turnosService.obtenerTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = this.turnos;
      this.cargarEspecialidadesYEspecialistas();
    });
  }

  cargarEspecialidadesYEspecialistas() {
    this.especialidades = [...new Set(this.turnos.map(turno => turno.especialidad))];
    this.especialistas = [...new Set(this.turnos.map(turno => turno.especialista))];
  }

  filtrarPorEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;
    this.filtrarTurnos();
  }

  filtrarPorEspecialista(especialista: string) {
    this.especialistaSeleccionado = especialista;
    this.filtrarTurnos();
  }

  quitarFiltros() {
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;
    this.turnosFiltrados = this.turnos;
  }

  filtrarTurnos() {
    this.turnosFiltrados = this.turnos.filter(turno => {
      return (!this.especialidadSeleccionada || turno.especialidad === this.especialidadSeleccionada) &&
             (!this.especialistaSeleccionado || turno.especialista === this.especialistaSeleccionado);
    });
  }

  abrirModalCancelar(turno: any) {
    this.turnoSeleccionado = turno;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.turnoSeleccionado = null;
    this.comentarioCancelacion = '';
  }

  cancelarTurno() {
    if (this.turnoSeleccionado) {
      this.turnosService.cancelarTurno(this.turnoSeleccionado.id, this.comentarioCancelacion).then(() => {
        this.turnoSeleccionado.estado = 'cancelado';
        this.cerrarModal();
      });
    }
  }

  puedeCancelar(turno: any): boolean {
    return !['aceptado', 'realizado', 'rechazado', 'cancelado'].includes(turno.estado);
  }

  convertirHora(horario: string): Date {
    const [hours, minutes] = horario.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  }
}
