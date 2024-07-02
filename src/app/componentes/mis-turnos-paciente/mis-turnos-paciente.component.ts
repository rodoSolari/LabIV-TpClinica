import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
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
  historiaClinica: any;
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
  searchText: string = '';


  constructor(
    private turnosService: TurnosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private historiaClinicaService: HistoriaClinicaService,
  ) {}

  ngOnInit(): void {
    this.authService.userLogged().subscribe(user => {
      if (user) {
        this.userData = user;
        this.cargarTurnos();
        this.historiaClinicaService.obtenerHistoriaClinica(this.userData.email).subscribe((historiaClinica: any[]) => {
          this.historiaClinica = historiaClinica;
          console.log(this.historiaClinica)
        });
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
        this.cargarHistoriaClinica(this.userData.email);
       // this.turnosFiltrados = turnos;
       // this.extraerEspecialidadesYEspecialistas();
      });
    }
  }



  cargarHistoriaClinica(email: string): void {
    this.historiaClinicaService.obtenerHistoriaClinica(email).subscribe(historia => {
      this.historiaClinica = historia;
      this.filtrarTurnos();  // Aplicar el filtro una vez que la historia clínica está cargada
    });
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
/*
  filtrarTurnos() {
    this.turnosFiltrados = this.turnos.filter(turno => {
      return (this.filtroEspecialidad === '' || turno.especialidad === this.filtroEspecialidad) &&
             (this.filtroEspecialista === '' || turno.especialista === this.filtroEspecialista);
    });
  }*/


    filtrarTurnos(): void {
      const searchText = this.searchText.toLowerCase();
      this.turnosFiltrados = this.turnos.filter(turno =>
        turno.especialidad.toLowerCase().includes(searchText) ||
        turno.especialista.toLowerCase().includes(searchText) ||
        turno.dia.toLowerCase().includes(searchText) ||
        turno.horario.toLowerCase().includes(searchText) ||
        turno.estado.toLowerCase().includes(searchText) ||
        this.historiaClinicaMatches(searchText)
      );
    }

    historiaClinicaMatches(searchText: string): boolean {
      if (!this.historiaClinica || this.historiaClinica.length === 0) return false;

    const lowerSearchText = searchText.toLowerCase();

    for (const historia of this.historiaClinica) {
      // Verificar los datos fijos
      const datosFijos = ['altura', 'peso', 'temperatura', 'presion'];
      for (const dato of datosFijos) {
        if (historia[dato] && historia[dato].toString().toLowerCase().includes(lowerSearchText)) {
          console.log(historia[dato])
          return true;

        }
      }


        for (const datoDinamico of historia.datosDinamicos) {
          console.log(datoDinamico);
          if (

            (datoDinamico.clave && datoDinamico.clave.toLowerCase().includes(lowerSearchText)) ||
            (datoDinamico.valor && datoDinamico.valor.toLowerCase().includes(lowerSearchText))
          ) {
            return true;
          }
        }

    }
      return false;
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

  transform(turnos: any[], searchText: string): any[] {
    if (!turnos || !searchText) {
      return turnos;
    }
    searchText = searchText.toLowerCase();
    return turnos.filter(turno =>
      Object.keys(turno).some(key =>
        turno[key].toString().toLowerCase().includes(searchText)
      )
    );
  }

}
