import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import Swal from 'sweetalert2';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { FiltroTurnosService } from 'src/app/services/filtro-turnos.service';

@Component({
  selector: 'app-mis-turnos-especialista',
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrls: ['./mis-turnos-especialista.component.scss']
})
export class MisTurnosEspecialistaComponent {
  @ViewChild('historiaClinicaModal') historiaClinicaModal!: ElementRef;
  historiaClinica: any;
  turnos: any[] = [];
  turnosFiltrados: any[] = [];
  pacientes: string[] = [];
  userData: any;
  selectedTurno: any;
  cancelacionForm!: FormGroup;
  rechazoForm!: FormGroup;
  reseniaForm!: FormGroup;
  historiaClinicaForm!: FormGroup;
  mostrarModalCancelar: boolean = false;
  mostrarModalRechazo: boolean = false;
  mostrarModalResenia: boolean = false;
  mostrarModalHistoriaClinica: boolean = false;
  historiasClinicas: any[] = [];
  searchTerm: string = '';

  rango : number = 0;
  cuadroTextoNumerico: string = '';
  switch: boolean = false;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService,
    private historiaClinicaService: HistoriaClinicaService,
    private fb: FormBuilder,
    private filtroTurnosService: FiltroTurnosService
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

    this.historiaClinicaForm = this.fb.group({
      altura: ['', Validators.required],
      peso: ['', Validators.required],
      temperatura: ['', Validators.required],
      presion: ['', Validators.required],
      datosDinamicos: this.fb.array([]),
      rangoKey: ['', Validators.required],
      rangoValue: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      cuadroTextoNumericoKey: ['', Validators.required],
      cuadroTextoNumericoValue: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      switchKey: ['', Validators.required],
      switchValue: [false, Validators.required]
    });
  }

  cargarTurnos() {
    //if (this.userData && this.userData.email) {
      this.turnosService.traerTurnosPorEspecialista(this.userData.email).subscribe(turnos => {
        this.turnos = turnos;
        this.aplicarFiltros();
      });

      this.historiaClinicaService.obtenerHistoriasClinicas().subscribe(historiasClinicas => {
        this.historiasClinicas = historiasClinicas;
        this.aplicarFiltros();
      });
  //  }
  }

  async aplicarFiltros(): Promise<void> {
    this.turnosFiltrados = this.filtroTurnosService.filterTurnos(this.turnos,this.historiasClinicas, this.searchTerm);
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

  abrirModalHistoriaClinica(turno: any) {
    this.selectedTurno = turno;
    console.log(turno);
    this.mostrarModalHistoriaClinica = true;
  }

  cerrarModal(tipo: string) {
    if (tipo === 'cancelar') {
      this.mostrarModalCancelar = false;
    } else if (tipo === 'rechazo') {
      this.mostrarModalRechazo = false;
    } else if (tipo === 'resenia') {
      this.mostrarModalResenia = false;
    }else if (tipo === 'historiaClinica') {
      this.mostrarModalHistoriaClinica = false;
    }
  }

  confirmarCancelarTurno() {
    if (this.cancelacionForm.valid && this.selectedTurno && this.selectedTurno.id) {
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
      console.error('Formulario de cancelación no es válido o ID de turno no definido');
    }
  }

  confirmarRechazoTurno() {
    if (this.rechazoForm.valid && this.selectedTurno && this.selectedTurno.id) {
      const comentario = this.rechazoForm.value.comentario;
      this.turnosService.rechazarTurno(this.selectedTurno.id, comentario).then(() => {
        this.cargarTurnos();
        this.cerrarModal('rechazo');
        Swal.fire('Turno rechazado', 'El turno ha sido rechazado con éxito', 'success');
      }).catch((error) => {
        console.error('Error al rechazar el turno:', error);
        Swal.fire('Error', 'Hubo un error al rechazar el turno', 'error');
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
        Swal.fire('Turno finalizado', 'El turno ha sido finalizado con éxito', 'success');
       // this.abrirModalHistoriaClinica(this.selectedTurno);
      }).catch((error) => {
        console.error('Error al finalizar el turno:', error);
        Swal.fire('Error', 'Hubo un error al finalizar el turno', 'error');
      });
    } else {
      console.error('Formulario de reseña no es válido o ID de turno no definido');
    }
  }

  confirmarHistoriaClinica() {
    if (this.historiaClinicaForm.valid && this.selectedTurno && this.selectedTurno.id) {
      const formValue = this.historiaClinicaForm.value;
      const datosDinamicosNuevos = [
        { clave: formValue.rangoKey, valor: formValue.rangoValue },
        { clave: formValue.cuadroTextoNumericoKey, valor: formValue.cuadroTextoNumericoValue },
        { clave: formValue.switchKey, valor: formValue.switchValue }
      ];

      const historiaClinica = {
        especialidad : this.selectedTurno.especialidad, //Agrego nombre especialidad
        altura: this.historiaClinicaForm.value.altura,
        peso: this.historiaClinicaForm.value.peso,
        temperatura: this.historiaClinicaForm.value.temperatura,
        presion: this.historiaClinicaForm.value.presion,
        datosDinamicos: this.historiaClinicaForm.value.datosDinamicos,
        datosDinamicosNuevos : datosDinamicosNuevos,
        historiaClinica : true,
        turnoId : this.selectedTurno.id,
        pacienteEmail : this.selectedTurno.pacienteEmail,
        especialistaEmail : this.selectedTurno.especialistaEmail
      };
      console.log(historiaClinica);
      this.historiaClinicaService.agregarHistoriaClinica(historiaClinica,this.selectedTurno.id).then(() => {
        this.cargarTurnos();
        this.cerrarModal('historiaClinica');
        Swal.fire('Historia Clínica cargada', 'La historia clínica ha sido cargada con éxito', 'success');
      }).catch((error) => {
        console.error('Error al cargar la historia clínica:', error);
        Swal.fire('Error', 'Hubo un error al cargar la historia clínica', 'error');
      });
    } else {
      console.error('Formulario de historia clínica no es válido o ID de turno no definido');
    }
  }

  aceptarTurno(turno: any) {
    if (turno && turno.id) {
      this.turnosService.aceptarTurno(turno.id).then(() => {
        this.cargarTurnos();
        Swal.fire('Turno aceptado', 'El turno ha sido aceptado con éxito', 'success');
      }).catch((error) => {
        console.error('Error al aceptar el turno:', error);
        Swal.fire('Error', 'Hubo un error al aceptar el turno', 'error');
      });
    } else {
      console.error('ID de turno no definido');
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

  addDatoDinamico(): void {
    const datosDinamicos = this.historiaClinicaForm.get('datosDinamicos') as FormArray;
    if (datosDinamicos.length < 3) {
      datosDinamicos.push(this.fb.group({
        clave: ['', Validators.required],
        valor: ['', Validators.required]
      }));
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'No se pueden agregar más de 3 datos dinámicos.',
        confirmButtonText: 'Entendido'
      });
    }
  }

  removeDatoDinamico(index: number): void {
    const datosDinamicos = this.historiaClinicaForm.get('datosDinamicos') as FormArray;
    datosDinamicos.removeAt(index);
  }

  get datosDinamicos(): FormArray {
    return this.historiaClinicaForm.get('datosDinamicos') as FormArray;
  }

  puedeCargarHistoriaClinica(turno: any): boolean {
    return turno.estado === 'realizado' && !turno.historiaClinica;
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
