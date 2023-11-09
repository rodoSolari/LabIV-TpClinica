import { Injectable } from '@angular/core';
import { sendEmailVerification } from '@angular/fire/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {Firestore, addDoc,collection,collectionData} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore : Firestore, private auth:AngularFireAuth) { }

  //se registra el mail de usuario y la fecha de logueo
  public subirLog( email: string, date:string){
    const col = collection(this.firestore,'logs');
    addDoc(col,{
      nombre: email,
      date: date
    });
  }

  public register(usuario : any, password: string){
    return this.auth.createUserWithEmailAndPassword(usuario.email, password)

  }

  public login(email : string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public confirmarMail(userCredential : any){
    return sendEmailVerification(userCredential.user);
  }

  //cerrar sesion
  public logout(){
    this.auth.signOut();
  }

  //Para verificar si el usuario está logueado
  public userLogged(){
    return this.auth.authState;
  }


}
