import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(private firestore: Firestore) {}

  async obtenerEncuestas(): Promise<any[]> {
    const coleccionEncuestas = collection(this.firestore, 'encuestas');
    const snapshot = await getDocs(coleccionEncuestas);
    return snapshot.docs.map(doc => doc.data());
  }
}
