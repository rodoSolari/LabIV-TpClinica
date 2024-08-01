import { Injectable } from '@angular/core';
import { TurnosService } from './turnos.service';
import { HistoriaClinicaService } from './historia-clinica.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltroTurnosService {

  constructor(
  ) { }

  filterTurnos(turnos: any[], historiasClinicas: any[], searchTerm: string): any[] {
    const term = searchTerm.toLowerCase();
    return turnos.filter(turno => {
      const historiaClinica = historiasClinicas.find(hc => hc.turnoId === turno.id);
      return turno.dia.toLowerCase().includes(term) ||
             turno.especialidad.toLowerCase().includes(term) ||
             turno.especialista.toLowerCase().includes(term) ||
             turno.pacienteApellido.toLowerCase().includes(term) ||
             turno.pacienteNombre.toLowerCase().includes(term) ||
             turno.estado.toLowerCase().includes(term) ||
             (historiaClinica && (
               historiaClinica.altura.toLowerCase().includes(term) ||
               historiaClinica.peso.toLowerCase().includes(term) ||
               historiaClinica.presion.toLowerCase().includes(term) ||
               historiaClinica.temperatura.toLowerCase().includes(term) ||
               historiaClinica.datosDinamicos.some((dato: any) => dato.clave.toLowerCase().includes(term) || dato.valor.toLowerCase().includes(term)) ||
               historiaClinica?.datosDinamicosNuevos?.some((dato: any) => dato.clave.toLowerCase().includes(term) || String(dato.valor).toLowerCase().includes(term))
             ));
    });
  }


}
