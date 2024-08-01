import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FiltroTurnosService } from 'src/app/services/filtro-turnos.service';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { TurnosService } from 'src/app/services/turnos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-turnos-paciente',
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrls: ['./mis-turnos-paciente.component.scss']
})
export class MisTurnosPacienteComponent {
  @ViewChild('historiaClinicaModal') historiaClinicaModal!: ElementRef;
  historiaClinica: any;
  historiasClinicas: any[] = [];
  userData: any;
  selectedTurno: any;
  encuestaForm!: FormGroup;
  calificacionForm!: FormGroup;
  cancelacionForm!: FormGroup;
  mostrarModalCancelar: boolean = false;
  mostrarModalEncuesta: boolean = false;
  mostrarModalCalificacion: boolean = false;
  searchText: string = '';

  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  searchTerm: string = '';

  constructor(
    private turnosService: TurnosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private filtroTurnosService: FiltroTurnosService,
    private historiaClinicaService : HistoriaClinicaService
  ) {}

  ngOnInit(): void {
   // console.log("TURNO: " + this.selectedTurno)
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
      this.turnosService.traerTurnosPorPaciente(this.userData.email).subscribe(turnos => {
        this.turnos = turnos;
        this.aplicarFiltros();
      });

      this.historiaClinicaService.obtenerHistoriasClinicas().subscribe(historiasClinicas => {
        this.historiasClinicas = historiasClinicas;
        this.aplicarFiltros();
      });
  }

  async aplicarFiltros(): Promise<void> {
    this.turnosFiltrados = this.filtroTurnosService.filterTurnos(this.turnos,this.historiasClinicas, this.searchTerm);
  }

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
        Swal.fire('Turno cancelado', 'El turno ha sido cancelado con éxito', 'success');
      }).catch((error) => {
        console.error('Error al cancelar el turno:', error);
        Swal.fire('Error', 'Hubo un error al cancelar el turno', 'error');
      });
    } else {
      console.error('No se puede cancelar el turno: ID de turno no definido');
      Swal.fire('Error', 'No se puede cancelar el turno', 'error');
    }
  }

  verResenia(turno: any) {
    Swal.fire({
      title: 'Reseña del Turno',
      text: turno.resenia,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
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
          Swal.fire({
            title: 'Encuesta del Turno',
            text: "encuesta enviada con exito!",
            icon: 'success',
            confirmButtonText: 'Cerrar'
          });
          this.cargarTurnos();
          this.cerrarModal('encuesta');
        }).catch((error) => {
          console.error('Error al enviar la encuesta:', error);
          Swal.fire('Error', 'Hubo un error al enviar la encuesta', 'error');
        });
      } else {
        console.error('No se puede completar la encuesta: ID de turno no definido');
        Swal.fire('Error', 'No se puede completar la encuesta', 'error');
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
          Swal.fire({
            title: 'calificacion del Turno',
            text: "calificacion enviada con exito!",
            icon: 'success',
            confirmButtonText: 'Cerrar'
          });
          this.cargarTurnos();
          this.cerrarModal('calificacion');
        }).catch((error) => {
          console.error('Error al enviar la calificación:', error);
          Swal.fire('Error', 'Hubo un error al enviar la calificación', 'error');
        });
      } else {
        console.error('No se puede calificar la atención: ID de turno no definido');
        Swal.fire('Error', 'No se puede calificar la atención', 'error');
      }
    }
  }

  verHistoriaClinica(turno: any) {
    this.historiaClinica = this.historiasClinicas.find(hc => hc.turnoId === turno.id);
    if (this.historiaClinica) {
      const modalElement = this.historiaClinicaModal.nativeElement;
      modalElement.style.display = 'block';
    }
  }

  closeModal(): void {
    const modalElement = this.historiaClinicaModal.nativeElement;
    modalElement.style.display = 'none';
  }
}
