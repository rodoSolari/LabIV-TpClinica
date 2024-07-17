import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {Firestore, addDoc,collection,collectionData,doc} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, finalize, map, switchMap } from 'rxjs';

import 'firebase/firestore';
import { getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private firestore: Firestore, private storage:AngularFireStorage) {}

 /* public async subirLog(email: string, date: string): Promise<void> {
    const col = collection(this.firestore, 'logs');
    await addDoc(col, {
      email: email,
      date: date
    });
  }*/

  addAdmin(adminData: any, imagen: File, uid: string): Promise<void> {
    const col = collection(this.firestore, 'Usuarios');
    const adminRef = doc(col, uid);
    const filePath = `usuarios/${uid}/${imagen.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, imagen);

    return new Promise((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: string) => {
            adminData.imagen1 = url;
            setDoc(adminRef, adminData)
              .then(() => resolve())
              .catch(error => reject(error));
          }, error => reject(error));
        })
      ).subscribe();
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

  getUserData(): Observable<any> {
    return this.auth.user.pipe(
      map(user => {
        if (user) {
          return {
            email: user.email,
            nombre: user.displayName?.split(' ')[0],
            apellido: user.displayName?.split(' ')[1]
          };
        } else {
          return null;
        }
      })
    );
  }
}
