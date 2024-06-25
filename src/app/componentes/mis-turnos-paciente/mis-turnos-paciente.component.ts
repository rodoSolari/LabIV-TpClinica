import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-turnos-paciente',
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrls: ['./mis-turnos-paciente.component.scss']
})
export class MisTurnosPacienteComponent {
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  especialidades: string[] = [];
  especialistas: string[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';
  userData: any;
  selectedTurno: any;
  encuestaForm!: FormGroup;
  calificacionForm!: FormGroup;
  cancelacionForm!: FormGroup;
  mostrarModalCancelar: boolean = false;
  mostrarModalEncuesta: boolean = false;
  mostrarModalCalificacion: boolean = false;

  constructor(
    private turnosService: TurnosService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.userLogged().subscribe(user => {
      if (user) {
        this.userData = user;
        this.cargarTurnos();
      }
    });

    this.encuestaForm = this.fb.group({
      encuesta: ['', Validators.required]
    });

    this.calificacionForm = this.fb.group({
      calificacion: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comentarios: ['']
    });

    this.cancelacionForm = this.fb.group({
      comentario: ['', Validators.required]
    });
  }

  cargarTurnos() {
    if (this.userData && this.userData.email) {
      this.turnosService.traerTurnosPorPaciente(this.userData.email).subscribe(turnos => {
        this.turnos = turnos;
        this.turnosFiltrados = turnos;
        this.extraerEspecialidadesYEspecialistas();
      });
    }
  }

  extraerEspecialidadesYEspecialistas() {
    const especialidadesSet = new Set<string>();
    const especialistasSet = new Set<string>();

    this.turnos.forEach(turno => {
      especialidadesSet.add(turno.especialidad);
     // especialistasSet.add(turno.especialistaEmail);
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

  /*  filtrarTurnos() {
      this.turnosFiltrados = this.turnos.filter(turno => {
        return (this.filtroEspecialidad === '' || turno.especialidad === this.filtroEspecialidad) &&
               (this.filtroEspecialista === '' || turno.especialistaEmail === this.filtroEspecialista);
      });
    }*/

  abrirModalCancelar(turno: any) {
    this.selectedTurno = turno;
    this.mostrarModalCancelar = true;
  }

  cerrarModal(tipo: string) {
    if (tipo === 'cancelar') {
      this.mostrarModalCancelar = false;
    } else if (tipo === 'encuesta') {
      this.mostrarModalEncuesta = false;
    } else if (tipo === 'calificacion') {
      this.mostrarModalCalificacion = false;
    }
  }

  confirmarCancelarTurno() {
    if (this.selectedTurno && this.selectedTurno.id) {
      const comentario = this.cancelacionForm.value.comentario;
      this.turnosService.cancelarTurno(this.selectedTurno.id, comentario).then(() => {
        this.cargarTurnos();
        this.cerrarModal('cancelar');
      }).catch((error) => {
        console.error('Error al cancelar el turno:', error);
      });
    } else {
      console.error('No se puede cancelar el turno: ID de turno no definido');
    }
  }


  verResenia(turno: any) {
    //Swal.(`Reseña: ${turno.resenia}`);
  }

  abrirModalEncuesta(turno: any) {
    this.selectedTurno = turno;
    this.mostrarModalEncuesta = true;
  }

  confirmarEncuesta() {
    if (this.encuestaForm.valid) {
      const encuesta = this.encuestaForm.value.encuesta;
      if (this.selectedTurno && this.selectedTurno.id) {
        this.turnosService.completarEncuesta(this.selectedTurno.id, encuesta).then(() => {
          this.cargarTurnos();
          this.cerrarModal('encuesta');
        }).catch((error) => {
          console.error('Error al enviar la encuesta:', error);
        });
      } else {
        console.error('No se puede completar la encuesta: ID de turno no definido');
      }
    }
  }

  abrirModalCalificacion(turno: any) {
    this.selectedTurno = turno;
    this.mostrarModalCalificacion = true;
  }

  confirmarCalificacion() {
    if (this.calificacionForm.valid) {
      const { calificacion, comentarios } = this.calificacionForm.value;
      if (this.selectedTurno && this.selectedTurno.id) {
        this.turnosService.calificarAtencion(this.selectedTurno.id, calificacion, comentarios).then(() => {
          this.cargarTurnos();
          this.cerrarModal('calificacion');
        }).catch((error) => {
          console.error('Error al enviar la calificación:', error);
        });
      } else {
        console.error('No se puede calificar la atención: ID de turno no definido');
      }
    }
  }


}
