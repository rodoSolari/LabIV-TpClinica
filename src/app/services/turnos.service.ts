import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { DocumentReference, addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import * as moment from 'moment';
import { collectionData } from 'rxfire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: Firestore) {}

  obtenerTurnos(): Observable<any[]> {
    const turnosRef = collection(this.firestore, 'Turnos');
    return collectionData(turnosRef, { idField: 'id' });
  }

  solicitarTurno(turnoData: any): Promise<DocumentReference> {
    const turnosRef = collection(this.firestore, 'Turnos');
    return addDoc(turnosRef, turnoData);
  }

  traerTurnosPorPaciente(email: string): Observable<any[]> {
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef, where('pacienteEmail', '==', email));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }


  traerTurnosPorEspecialista(email: string): Observable<any[]> {
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef, where('especialistaEmail', '==', email));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  aceptarTurno(turnoId: string): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, { estado: 'aceptado' });
  }

  rechazarTurno(turnoId: string, comentario: string): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, { estado: 'rechazado', comentarioRechazo: comentario });
  }

  finalizarTurno(turnoId: string, resenia: string): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, { estado: 'realizado', resenia });
  }

  cancelarTurno(turnoId: string, comentario: string): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, { estado: 'cancelado', comentarioCancelacion: comentario });
  }

  cancelarTurnoPorID(turnoId: string): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, { estado: 'cancelado'});
  }


  obtenerTurnosReservados(dia: string, especialidad: string, especialista: string): Observable<any[]> {
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef,
      where('dia', '==', dia),
      where('especialidad', '==', especialidad),
      where('especialista', '==', especialista)
    );
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;  //Si algo falla, sacar el , { idField: 'id' })
  }

  calificarAtencion(turnoId: string, calificacion: number, comentarios: string): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, { calificacion, comentarios });
  }

  completarEncuesta(turnoId: string, encuesta: any): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, { encuesta });
  }

  obtenerPacientesAtendidos(): Observable<any[]> {
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef, where('estado', '==', 'realizado'));
    return collectionData(q).pipe(
      map((turnos: any[]) => {
        const pacientes: any[] = [];
        turnos.forEach((turno: any) => {
          pacientes.push({
            nombre: turno.pacienteNombre,
            apellido: turno.pacienteApellido,
            email: turno.pacienteEmail
          });
        });
        return pacientes;
      })
    );
  }

  obtenerTurnosRealizadosEspecialista(email: string): Observable<any[]> {
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef, where('especialistaEmail', '==', email), where('estado', '==', 'realizado'));
    return collectionData(q) as Observable<any[]>;
  }

  obtenerHistoriaClinica(email: string): Observable<any[]> {
    const historiasRef = collection(this.firestore, 'HistoriasClinicas');
    const q = query(historiasRef, where('pacienteEmail', '==', email));
    return collectionData(q).pipe(
      map((historias: any[]) => {
        return historias.length ? historias[0] : null; // Suponiendo que hay solo una historia clínica por paciente
      })
    );
  }

  actualizarTurno(turnoId: string, data: any): Promise<void> {
    const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
    return updateDoc(turnoDoc, data);
  }

  async obtenerCantidadTurnosPorEspecialidad(): Promise<any> {
    const coleccionTurnos = collection(this.firestore, 'Turnos');
    const snapshot = await getDocs(coleccionTurnos);
    const turnos = snapshot.docs.map(doc => doc.data());

    const cantidadPorEspecialidad: { [key: string]: number } = {};

    turnos.forEach(turno => {
      const especialidad = turno['especialidad'];
      if (cantidadPorEspecialidad[especialidad]) {
        cantidadPorEspecialidad[especialidad]++;
      } else {
        cantidadPorEspecialidad[especialidad] = 1;
      }
    });

    return cantidadPorEspecialidad;
  }

  async obtenerCantidadTurnosPorDia(): Promise<any> {
    const coleccionTurnos = collection(this.firestore, 'Turnos');
    const snapshot = await getDocs(coleccionTurnos);
    const turnos = snapshot.docs.map(doc => doc.data());

    const cantidadPorDia: { [key: string]: number } = {};

    turnos.forEach(turno => {
      const dia = turno['dia'];
      if (cantidadPorDia[dia]) {
        cantidadPorDia[dia]++;
      } else {
        cantidadPorDia[dia] = 1;
      }
    });

    return cantidadPorDia;
  }

  async obtenerTurnosUltimos30Dias(): Promise<any> {
    const coleccionTurnos = collection(this.firestore, 'Turnos');
    const treintaDiasAtras = moment().subtract(200, 'days').format('YYYY-MM-DD');

    const q = query(coleccionTurnos, where('dia', '>=', treintaDiasAtras));
    const snapshot = await getDocs(q);

    const turnos = snapshot.docs.map(doc => doc.data());
    return turnos;
  }

  async obtenerCantidadTurnosPorEspecialidadAgrupado(): Promise<any> {
    const coleccionTurnos = collection(this.firestore, 'Turnos');
    const snapshot = await getDocs(coleccionTurnos);
    const turnos = snapshot.docs.map(doc => doc.data());

    const especialidadesPorPaciente: { [especialidad: string]: Set<string> } = {};

    turnos.forEach(turno => {
      const especialidad = turno['especialidad'];
      const pacienteEmail = turno['pacienteEmail'];

      if (!especialidadesPorPaciente[especialidad]) {
        especialidadesPorPaciente[especialidad] = new Set();
      }

      especialidadesPorPaciente[especialidad].add(pacienteEmail);
    });

    const cantidadPorEspecialidad: { [key: string]: number } = {};
    Object.keys(especialidadesPorPaciente).forEach(especialidad => {
      cantidadPorEspecialidad[especialidad] = especialidadesPorPaciente[especialidad].size;
    });

    return cantidadPorEspecialidad;
  }

}
