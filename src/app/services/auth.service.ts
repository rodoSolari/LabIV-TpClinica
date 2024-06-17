import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {Firestore, addDoc,collection,collectionData,doc} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, switchMap } from 'rxjs';

import 'firebase/firestore';
import { getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private firestore: Firestore) {}

  public async subirLog(email: string, date: string): Promise<void> {
    const col = collection(this.firestore, 'logs');
    await addDoc(col, {
      nombre: email,
      date: date
    });
  }

  public async addAdmin(admin: any): Promise<void> {
    const col = collection(this.firestore, 'Usuarios');
    const userCredential = await this.auth.createUserWithEmailAndPassword(admin.email, admin.password);
    const uid = userCredential.user?.uid;
    console.log("UID del nuevo usuario:", uid); // Agrega este log para verificar el UID

    return setDoc(doc(this.firestore, `Usuarios/${uid}`), {
      nombre: admin.nombre,
      apellido: admin.apellido,
      edad: admin.edad,
      dni: admin.dni,
      email: admin.email,
      tipo: 'administrador',
      estadoAprobado: true,
      estadoAprobadoPorAdmin: true
    });
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

  public register(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  public async login(email: string, password: string) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;
      const userDocRef = doc(this.firestore, `Usuarios/${uid}`);
      const userDocSnap = await getDoc(userDocRef);

      console.log(userDocRef.path);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const emailVerified = userCredential.user?.emailVerified;

        if (userData['tipo'] === 'especialista' && (!userData['estadoAprobadoPorAdmin'] || !emailVerified)) {
          //await this.auth.signOut();
          throw { code: 'especialista/no-aprobado', message: 'Tu cuenta de especialista no ha sido aprobada por un administrador o no has verificado tu correo electrónico.' };
        }

        if (userData['tipo'] === 'paciente' && !emailVerified) {
         // await this.auth.signOut();
          throw { code: 'paciente/no-verificado', message: 'No has verificado tu correo electrónico.' };
        }

        // Administradores pueden iniciar sesión sin verificación de correo
        if (userData['tipo'] === 'administrador') {
          return userCredential;
        }

        return userCredential;
      } else {
        await this.auth.signOut();
        throw { code: 'usuario/no-encontrado', message: 'No se encontraron datos de usuario.' };
      }
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  }

  public confirmarMail(user: any) {
    return user.sendEmailVerification();
  }

  public async logout() {
    await this.auth.signOut();
    window.location.reload();
  }

  public userLogged() {
    return this.auth.authState;
  }

  public async obtenerDatosUsuario(email: string): Promise<any> {
    const q = query(collection(this.firestore, "Usuarios"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });
    return userData;
  }
}
