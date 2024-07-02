import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, query, setDoc, updateDoc, where } from 'firebase/firestore';
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

  agregarHistoriaClinica(historiaClinica: any, turnoId: string): Promise<void> {
    const historiasRef = collection(this.firestore, 'HistoriasClinicas');
    return addDoc(historiasRef, historiaClinica)
      .then(() => {
        const turnoDoc = doc(this.firestore, `Turnos/${turnoId}`);
        return updateDoc(turnoDoc, { historiaClinica: true

        });
      })
      .catch((error) => {
        console.error('Error al agregar la historia clínica: ', error);
        throw error;
      });
  }

}
