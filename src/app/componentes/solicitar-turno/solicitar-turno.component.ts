import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent {
  solicitarTurnoForm!: FormGroup;
  especialidades: any[] = [];
  especialistas: any[] = [];
  diasDisponibles: string[] = [];
  horariosReservados: { [key: string]: string[] } = {};
  especialidadSeleccionada: any = '';
  especialistaSeleccionado: any;
  diaSeleccionado: string = '';
  horarioSeleccionado: { dia: string, horario: string } | null = null;
  mensaje: string = '';
  userData: any;

  especialidadImagenes: { [key: string]: string } = {
    'oftalmologia': '../../../assets/oftalmologia.jpg',
    'traumatologia': '../../../assets/traumatologia.jpg',
    'odontologia': '../../../assets/odontologia.jpg',
    'radiologia': '../../../assets/radiologia.jpg',
    'default': '../../../assets/default-specialty.jpg'
  };

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private turnosService: TurnosService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.solicitarTurnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      dia: ['', Validators.required],
      horario: ['', Validators.required]
    });

    this.authService.userLogged().subscribe(async user => {
      if (user) {
        this.userData = await this.authService.obtenerDatosUsuario(user.email!);
      }
    });

    this.usuarioService.traerEspecialistas().subscribe(especialistas => {
      this.especialistas = especialistas;
      this.cdr.detectChanges();
    });

    this.diasDisponibles = this.generarDiasDisponibles();
  }

  selectEspecialidad(especialidad: any) {
    this.especialidadSeleccionada = especialidad;
    this.solicitarTurnoForm.patchValue({ especialidad: especialidad.nombre });
    this.diasDisponibles.forEach(dia => {
      this.obtenerHorariosReservados(dia, this.especialidadSeleccionada.nombre, this.especialistaSeleccionado.nombre);
    });
    this.cdr.detectChanges();
  }

  selectEspecialista(especialista: any) {
    this.solicitarTurnoForm.patchValue({ especialista: especialista.nombre });
    this.especialistaSeleccionado = especialista;

    const especialidadesDelEspecialista = [especialista.especialidad, especialista.especialidad2].filter(especialidad => especialidad);
    this.especialidades = especialidadesDelEspecialista.map(especialidad => ({ nombre: especialidad }));
    this.especialidades.forEach(especialidad => {
      console.log("Especialidad: ", especialidad);
    });

    this.cdr.detectChanges();
  }

  getEspecialidadImagen(especialidad: string): string {
    return this.especialidadImagenes[especialidad.toLowerCase()] || this.especialidadImagenes['default'];
  }

  selectHorario(dia: string, horario: string) {
    this.horarioSeleccionado = { dia, horario };
    this.diaSeleccionado = dia;
    this.solicitarTurnoForm.patchValue({ dia, horario });
  }

  generarDiasDisponibles(): string[] {
    const dias = [];
    const hoy = moment();
    for (let i = 0; i < 15; i++) {
      dias.push(hoy.clone().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dias;
  }

  generarHorariosDisponibles(dia: string): string[] {
    const horarios = [];
    const diaSemana = moment(dia).day();
    const disponibilidad = this.especialistaSeleccionado?.horariosDisponibles?.find((d: any) => this.getDayName(diaSemana) === d.dia);

    if (disponibilidad) {
      let horaInicio = moment(disponibilidad.horarioInicio, 'HH:mm');
      const horaFin = moment(disponibilidad.horarioFin, 'HH:mm');

      while (horaInicio.isBefore(horaFin) || horaInicio.isSame(horaFin)) {
        horarios.push(horaInicio.format('HH:mm'));
        horaInicio = horaInicio.clone().add(30, 'minutes');
      }
    }

    return horarios;
  }

  obtenerHorariosReservados(dia: string, especialidad: string, especialista: string) {
    if (dia && especialidad && especialista) {
      this.turnosService.obtenerTurnosReservados(dia, especialidad, especialista).subscribe(turnos => {
        this.horariosReservados[dia] = turnos.map(turno => turno.horario);
        this.cdr.detectChanges();
      });
    }
  }

  onSubmit() {
    if (this.solicitarTurnoForm.valid && this.isFormValid()) {
      const turnoData = {
        ...this.solicitarTurnoForm.value,
        pacienteEmail: this.userData.email,
        pacienteNombre: this.userData.nombre,
        pacienteApellido: this.userData.apellido,
        especialistaEmail: this.especialistaSeleccionado.email,
        estado: 'pendiente'
      };
      this.turnosService.solicitarTurno(turnoData).then(() => {
        Swal.fire({
          title: 'Turno Solicitado',
          text: 'Se ha cargado correctamente su turno!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.resetForm();
        });
      }).catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Error al solicitar turno: ' + error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  resetForm() {
    this.solicitarTurnoForm.reset();
    this.especialidadSeleccionada = '';
    this.especialistaSeleccionado = null;
    this.diaSeleccionado = '';
    this.horarioSeleccionado = null;
  }

  isFormValid(): boolean {
    return this.especialidadSeleccionada && this.especialistaSeleccionado && this.diaSeleccionado && this.horarioSeleccionado;
  }

  private getDayName(dayIndex: number): string {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[dayIndex];
  }
}
