import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-mis-turnos-especialista',
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrls: ['./mis-turnos-especialista.component.scss']
})
export class MisTurnosEspecialistaComponent {
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  especialidades: string[] = [];
  pacientes: string[] = [];
  filtroEspecialidad: string = '';
  filtroPaciente: string = '';
  userData: any;
  selectedTurno: any;
  cancelacionForm!: FormGroup;
  rechazoForm!: FormGroup;
  reseniaForm!: FormGroup;
  mostrarModalCancelar: boolean = false;
  mostrarModalRechazo: boolean = false;
  mostrarModalResenia: boolean = false;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.userLogged().subscribe(user => {
      if (user) {
        this.userData = user;
        this.cargarTurnos();
      }
    });

    this.cancelacionForm = this.fb.group({
      comentario: ['', Validators.required]
    });

    this.rechazoForm = this.fb.group({
      comentario: ['', Validators.required]
    });

    this.reseniaForm = this.fb.group({
      resenia: ['', Validators.required]
    });
  }

  cargarTurnos() {
    if (this.userData && this.userData.email) {
      this.turnosService.traerTurnosPorEspecialista(this.userData.email).subscribe(turnos => {
        this.turnos = turnos;
        this.turnosFiltrados = turnos;
        this.extraerEspecialidadesYPacientes();
      });
    }
  }

  extraerEspecialidadesYPacientes() {
    const especialidadesSet = new Set<string>();
    const pacientesSet = new Set<string>();

    this.turnos.forEach(turno => {
      especialidadesSet.add(turno.especialidad);
      pacientesSet.add(turno.paciente);
    });

    this.especialidades = Array.from(especialidadesSet);
    this.pacientes = Array.from(pacientesSet);
  }

  filtrarTurnos() {
    this.turnosFiltrados = this.turnos.filter(turno => {
      return (this.filtroEspecialidad === '' || turno.especialidad === this.filtroEspecialidad) &&
             (this.filtroPaciente === '' || turno.pacienteEmail === this.filtroPaciente);
    });
  }

  abrirModalCancelar(turno: any) {
    this.selectedTurno = turno;
    this.mostrarModalCancelar = true;
  }

  abrirModalRechazo(turno: any) {
    this.selectedTurno = turno;
    this.mostrarModalRechazo = true;
  }

  abrirModalResenia(turno: any) {
    this.selectedTurno = turno;
    this.mostrarModalResenia = true;
  }

  cerrarModal(tipo: string) {
    if (tipo === 'cancelar') {
      this.mostrarModalCancelar = false;
    } else if (tipo === 'rechazo') {
      this.mostrarModalRechazo = false;
    } else if (tipo === 'resenia') {
      this.mostrarModalResenia = false;
    }
  }

  confirmarCancelarTurno() {
    if (this.cancelacionForm.valid && this.selectedTurno && this.selectedTurno.id) {
      const comentario = this.cancelacionForm.value.comentario;
      this.turnosService.cancelarTurno(this.selectedTurno.id, comentario).then(() => {
        this.cargarTurnos();
        this.cerrarModal('cancelar');
      }).catch((error) => {
        console.error('Error al cancelar el turno:', error);
      });
    } else {
      console.error('Formulario de cancelación no es válido o ID de turno no definido');
    }
  }

  confirmarRechazoTurno() {
    if (this.rechazoForm.valid && this.selectedTurno && this.selectedTurno.id) {
      const comentario = this.rechazoForm.value.comentario;
      this.turnosService.rechazarTurno(this.selectedTurno.id, comentario).then(() => {
        this.cargarTurnos();
        this.cerrarModal('rechazo');
      }).catch((error) => {
        console.error('Error al rechazar el turno:', error);
      });
    } else {
      console.error('Formulario de rechazo no es válido o ID de turno no definido');
    }
  }

  confirmarResenia() {
    if (this.reseniaForm.valid && this.selectedTurno && this.selectedTurno.id) {
      const resenia = this.reseniaForm.value.resenia;
      this.turnosService.finalizarTurno(this.selectedTurno.id, resenia).then(() => {
        this.cargarTurnos();
        this.cerrarModal('resenia');
      }).catch((error) => {
        console.error('Error al finalizar el turno:', error);
      });
    } else {
      console.error('Formulario de reseña no es válido o ID de turno no definido');
    }
  }

  aceptarTurno(turno: any) {
    if (turno && turno.id) {
      this.turnosService.aceptarTurno(turno.id).then(() => {
        this.cargarTurnos();
      }).catch((error) => {
        console.error('Error al aceptar el turno:', error);
      });
    } else {
      console.error('ID de turno no definido');
    }
  }
}
