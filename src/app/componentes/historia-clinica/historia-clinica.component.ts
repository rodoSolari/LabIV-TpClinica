import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Routes } from '@angular/router';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { TurnosService } from 'src/app/services/turnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.scss']
})
export class HistoriaClinicaComponent {
  @Input() pacienteEmail!: string;
  historiaClinica: any[] = [];

  constructor(private historiaClinicaService: HistoriaClinicaService) { }

  ngOnInit(): void {
    if (this.pacienteEmail) {
      this.cargarHistoriaClinica();
    }
  }

  ngOnChanges(): void {
    if (this.pacienteEmail) {
      this.cargarHistoriaClinica();
    }
  }

  cargarHistoriaClinica(): void {
    this.historiaClinicaService.obtenerHistoriaClinica(this.pacienteEmail).subscribe((historiaClinica: any[]) => {
      this.historiaClinica = historiaClinica;
    });
  }
}
