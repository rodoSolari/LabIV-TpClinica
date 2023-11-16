import { Injectable } from '@angular/core';
import { sendEmailVerification } from '@angular/fire/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {Firestore, addDoc,collection,collectionData} from '@angular/fire/firestore';
import { Paciente } from '../clases/paciente';

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

  traerEspecialidaes(){
    const col = collection(this.firestore,'Especialidades');
    const observable = collectionData(col);
    return observable;
  }

  agregarEspecialidad(nombreEspecialidad : string){
    const col = collection(this.firestore,'Especialidades');
    addDoc(col,{
      nombre: nombreEspecialidad
    });
  }

  public register(email : string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password)

  }

  public login(email : string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public confirmarMail(userCredential : any){
    return userCredential.sendEmailVerification();
  }

  public addPaciente(paciente : any){
    const col = collection(this.firestore,'Usuarios');
    addDoc(col,{
      nombre : paciente.nombre,
      apellido : paciente.apellido,
      edad : paciente.edad,
      dni : paciente.dni,
      email : paciente.email,
      tipo : 'paciente',
      estadoAprobado : false,
      estadoAprobadoPorAdmin : true
    });
    console.log("agregado")
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
