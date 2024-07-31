import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent {
  pacientes: any[] = [];
  pacienteSeleccionado: any;
  historiaClinica: any;
  turnosRealizados: any[] = [];
  modalHistoriaClinica:  boolean = false;
  constructor(private turnosService: TurnosService,
              private authService: AuthService,
              private historiaClinicaService : HistoriaClinicaService
            ) {}

  ngOnInit(): void {
    this.authService.userLogged().subscribe(user => {
      if (user && user.email) {
        this.turnosService.obtenerTurnosRealizadosEspecialista(user.email).subscribe({
          next: (turnos) => {
            this.pacientes = turnos.map(turno => ({
              pacienteNombre: turno.pacienteNombre,
              pacienteApellido: turno.pacienteApellido,
              pacienteEmail: turno.pacienteEmail,
            })).filter((v, i, a) => a.findIndex(t => (t.pacienteEmail === v.pacienteEmail)) === i);
          },
          error: (error) => {
            console.error('Error al obtener turnos realizados:', error);
          }
        });
      }
    });
  }

  verHistoriaClinica(paciente: any) {
    this.pacienteSeleccionado = paciente;
    console.log(this.pacienteSeleccionado);
    this.historiaClinicaService.obtenerHistoriaClinica(this.pacienteSeleccionado.pacienteEmail).subscribe((historiaClinica : any[]) => {
      this.historiaClinica = historiaClinica;
      console.log(this.historiaClinica);
      this.abrirModal('historiaClinicaModal');
    });
  }

  abrirModal(id: string) {
    const modal = document.getElementById(id);
    this.modalHistoriaClinica = true;
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModal(id: string) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
