import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, query, setDoc, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  constructor(private firestore: Firestore) {}

  obtenerHistoriaClinica(email: string): Observable<any> {
    const historiasRef = collection(this.firestore, 'HistoriasClinicas');
    const q = query(historiasRef, where('pacienteEmail', '==', email));
    return collectionData(q);
  }

  guardarHistoriaClinica(historiaData: any): Promise<void> {
    const historiaDoc = doc(this.firestore, `HistoriasClinicas/${historiaData.pacienteEmail}`);
    return setDoc(historiaDoc, historiaData, { merge: true });
  }

  agregarHistoriaClinica(historiaClinica: any): Promise<void> {
    const historiaClinicaRef = collection(this.firestore, 'HistoriasClinicas');
    return addDoc(historiaClinicaRef, historiaClinica).then(() => {
      console.log('Historia clínica agregada con éxito');
    }).catch((error) => {
      console.error('Error agregando historia clínica: ', error);
    });
  }

}
