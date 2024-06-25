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
  especialidades: string[] = [];
  especialistas: any[] = [];
  diasDisponibles: string[] = [];
  horariosDisponibles: string[] = [];
  horariosReservados: { [key: string]: string[] } = {};
  especialidadSeleccionada: string = '';
  especialistaSeleccionado: any;
  diaSeleccionado: string  = '';
  horarioSeleccionado: { dia: string, horario: string } | null = null;
  mensaje: string = '';
  userData: any;

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
      dia: ['', ],
      horario: ['', Validators.required]
    });

    this.authService.userLogged().subscribe(async user => {
      if (user) {
        this.userData = await this.authService.obtenerDatosUsuario(user.email!);
        console.log('User Data:', this.userData); // Añadir esta línea para depuración
      }
    });


    this.usuarioService.traerEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });

    this.diasDisponibles = this.generarDiasDisponibles();

    this.diasDisponibles.forEach(dia => {
      this.obtenerHorariosReservados(dia, this.especialidadSeleccionada, this.especialistaSeleccionado?.nombre || '');
    });
  }

  selectEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;
    this.solicitarTurnoForm.patchValue({ especialidad });

    this.usuarioService.traerEspecialistasPorEspecialidad(especialidad).subscribe(especialistas => {
      this.especialistas = especialistas;
      this.solicitarTurnoForm.patchValue({ especialista: '' });

      this.diasDisponibles.forEach(dia => {
        this.obtenerHorariosReservados(dia, this.especialidadSeleccionada, this.especialistaSeleccionado?.nombre || '');
      });

      this.cdr.detectChanges();
    });
  }

  selectEspecialista(especialista: any) {
    this.solicitarTurnoForm.patchValue({ especialista: especialista.nombre });
    this.especialistaSeleccionado = especialista;

    // Obtener horarios reservados nuevamente cuando se selecciona un especialista
    this.diasDisponibles.forEach(dia => {
      this.obtenerHorariosReservados(dia, this.especialidadSeleccionada, this.especialistaSeleccionado?.nombre || '');
    });

    this.cdr.detectChanges();
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
    const horaInicio = diaSemana === 6 ? 8 : 8; // Sábado 8:00, Otros días 8:00
    const horaFin = diaSemana === 6 ? 14 : 19; // Sábado 14:00, Otros días 19:00

    for (let h = horaInicio; h < horaFin; h++) {
      for (let m = 0; m < 60; m += 30) {
        horarios.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }

    return horarios;
  }

  obtenerHorariosReservados(dia: string, especialidad: string, especialista: string) {
    this.turnosService.obtenerTurnosReservados(dia, especialidad, especialista).subscribe(turnos => {
      this.horariosReservados[dia] = turnos.map(turno => turno.horario);
      this.cdr.detectChanges();
    });
  }


  onSubmit() {
    if (this.solicitarTurnoForm.valid && this.isFormValid()) {
      const turnoData = {
        ...this.solicitarTurnoForm.value,
        pacienteEmail: this.userData.email,
        pacienteNombre: this.userData.nombre,
        pacienteApellido: this.userData.apellido,
        especialistaEmail: this.especialistaSeleccionado.email
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
      console.error('Error al solicitar turno:', error);
    });
    }
  }

  resetForm() {
    this.solicitarTurnoForm.reset();
    this.especialidadSeleccionada = '';
    this.especialistaSeleccionado = null;
    this.diaSeleccionado = '';
    this.horarioSeleccionado = null;
    this.cdr.detectChanges();
  }

  isFormValid(): boolean {
    return this.especialidadSeleccionada && this.especialistaSeleccionado && this.diaSeleccionado && this.horarioSeleccionado;
  }
}
