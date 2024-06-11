import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore,collection, collectionData, deleteDoc, doc  } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestore: Firestore) {}

  traerUsuarios() {
    const col = collection(this.firestore, 'Usuarios');
    return collectionData(col, { idField: 'id' });
  }

  habilitarEspecialista(id: string): Promise<void> {
    const userDoc = doc(this.firestore, `Usuarios/${id}`);
    return updateDoc(userDoc, { estadoAprobadoPorAdmin: true });
  }

  eliminar(id: string): Promise<void> {
    const userDoc = doc(this.firestore, `Usuarios/${id}`);
    return deleteDoc(userDoc);
  }

  addPaciente(pacienteData: any, imagen1: File, imagen2: File, uid: string): Promise<void> {
    const pacienteDocRef = doc(this.firestore, `Usuarios/${uid}`);

    return setDoc(pacienteDocRef, pacienteData).then(() => {
      const storage = getStorage();
      const imagen1Ref = ref(storage, `usuarios/${uid}/imagen1.jpg`);
      const imagen2Ref = ref(storage, `usuarios/${uid}/imagen2.jpg`);

      return Promise.all([
        uploadBytes(imagen1Ref, imagen1),
        uploadBytes(imagen2Ref, imagen2)
      ]).then(([snapshot1, snapshot2]) => {
        return Promise.all([
          getDownloadURL(snapshot1.ref),
          getDownloadURL(snapshot2.ref)
        ]);
      }).then(([url1, url2]) => {
        return updateDoc(pacienteDocRef, { imagen1: url1, imagen2: url2 });
      });
    }).then(() => {}); // Convertimos la Promesa a Promise<void>
  }

  addEspecialista(especialistaData: any, imagen1: File, uid: string): Promise<void> {
    const especialistaDocRef = doc(this.firestore, `Usuarios/${uid}`);

    return setDoc(especialistaDocRef, especialistaData).then(() => {
      const storage = getStorage();
      const imagen1Ref = ref(storage, `usuarios/${uid}/imagen1.jpg`);

      return uploadBytes(imagen1Ref, imagen1).then((snapshot1) => {
        return getDownloadURL(snapshot1.ref);
      }).then((url1) => {
        return updateDoc(especialistaDocRef, { imagen1: url1 });
      });
    }).then(() => {}); // Convertimos la Promesa a Promise<void>
  }
}
