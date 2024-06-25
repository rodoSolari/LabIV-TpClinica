import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { DocumentReference, addDoc, collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: Firestore) {}

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
}
