import { Injectable } from '@angular/core';
import { collection,query, Firestore,collectionData, addDoc, QueryDocumentSnapshot, orderBy, startAfter, limit, getDocs } from '@angular/fire/firestore';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private firestore: Firestore) { }

  obtenerLogs(): Observable<any[]> {
    const logsCollection = collection(this.firestore, 'logs');
    return collectionData(logsCollection);
  }

  async subirLog(email: string): Promise<void> {
    const coleccionLogs = collection(this.firestore, 'logs');
    const ahora = moment().format('YYYY-MM-DD HH:mm:ss');

    await addDoc(coleccionLogs, {
      email: email,
      fechaHora: ahora
    });
  }

  async obtenerTodosLosLogs(): Promise<any[]> {
    const coleccionLogs = collection(this.firestore, 'logs');
    const consulta = query(coleccionLogs, orderBy('fechaHora', 'desc'));
    const resultado = await getDocs(consulta);
    return resultado.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async obtenerLogsOrdenados(ultimoVisible: QueryDocumentSnapshot | null, tamanioPagina: number): Promise<any[]> {
    const coleccionLogs = collection(this.firestore, 'logs');
    let consulta;

    if (ultimoVisible) {
      consulta = query(coleccionLogs, orderBy('fechaHora', 'desc'), startAfter(ultimoVisible), limit(tamanioPagina));
    } else {
      consulta = query(coleccionLogs, orderBy('fechaHora', 'desc'), limit(tamanioPagina));
    }

    const resultado = await getDocs(consulta);
    return resultado.docs;
  }
}
