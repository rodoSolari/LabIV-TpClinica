import { Injectable } from '@angular/core';
import { Firestore,collection, collectionData, deleteDoc, doc  } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { addDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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


  public traerEspecialidades(): Observable<string[]> {
    const col = collection(this.firestore, 'Especialidades');
    return collectionData(col).pipe(
      map((especialidades: any[]) => especialidades.map(e => e.nombre))
    );
  }

  public agregarEspecialidad(nombreEspecialidad: string) {
    const col = collection(this.firestore, 'Especialidades');
    return addDoc(col, {
      nombre: nombreEspecialidad
    });
  }

  traerPacientes(): Observable<any[]> {
    const pacientesRef = collection(this.firestore, 'Usuarios');
    const q = query(pacientesRef, where('tipo', '==', 'paciente'));
    return collectionData(q) as Observable<any[]>;
  }

  traerEspecialistasPorEspecialidad(especialidad: string): Observable<any[]> {
    const especialistasRef = collection(this.firestore, 'Usuarios');
    const q = query(especialistasRef, where('especialidad', '==', especialidad));
    return collectionData(q) as Observable<any[]>;
  }

  traerEspecialistas(): Observable<any[]> {
    const especialistasRef = collection(this.firestore, 'Usuarios');
    const q = query(especialistasRef, where('tipo', '==', 'especialista'));
    return collectionData(q) as Observable<any[]>;
  }

  async actualizarDatosUsuario(userData: any): Promise<void> {
    const q = query(collection(this.firestore, 'Usuarios'), where('email', '==', userData.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      const userDocRef = doc(this.firestore, 'Usuarios', docSnap.id);
      await updateDoc(userDocRef, userData);
    });
  }

  obtenerTurnosUsuario(email: string): Observable<any[]> {
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(turnosRef, where('pacienteEmail', '==', email));
    return collectionData(q) as Observable<any[]>;
  }

  traerCamposEspecificosUsuarios(): Observable<any[]> {
    const usuariosRef = collection(this.firestore, 'Usuarios');
    const q = query(usuariosRef,where('tipo','==','paciente')); // Puedes agregar filtros aquí si es necesario
    return collectionData(q, { idField: 'id' }).pipe(
      map(users => users.map(user => ({
        nombre: user['nombre'],
        apellido: user['apellido'],
        email: user['email'],
        dni: user['dni'],
        edad: user['edad'],
        obraSocial: user['obraSocial'],
        imagen1:user['imagen1'],
        imagen2:user['imagen2']
      })))
    ) as Observable<any[]>;
  }

}
