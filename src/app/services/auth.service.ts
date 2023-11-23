import { Injectable } from '@angular/core';
import { sendEmailVerification } from '@angular/fire/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {Firestore, addDoc,collection,collectionData,doc} from '@angular/fire/firestore';
import { Paciente } from '../clases/paciente';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore : Firestore, private auth:AngularFireAuth, private angularFire : AngularFirestore) { }

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

  public addPaciente(usuario : any,tipo : string){
    console.log("tipo de usuario registraod:" + tipo);
    var aprobado : boolean = usuario.tipo == 'paciente' ? true : false;
    const col = collection(this.firestore,'Usuarios');
   // const documento = this.firestore.doc('Usuarios');
   if(tipo == 'paciente'){
    addDoc(col,{
     // id : documento.ref.id,
      nombre : usuario.nombre,
      apellido : usuario.apellido,
      edad : usuario.edad,
      dni : usuario.dni,
      email : usuario.email,
      obraSocial : usuario.obraSocial,
      tipo : tipo,
      estadoAprobado : false,
      estadoAprobadoPorAdmin : aprobado
    });
  }else{
    addDoc(col,{
      // id : documento.ref.id,
       nombre : usuario.nombre,
       apellido : usuario.apellido,
       edad : usuario.edad,
       dni : usuario.dni,
       email : usuario.email,
       tipo : tipo,
       estadoAprobado : false,
       estadoAprobadoPorAdmin : aprobado,
       especialidad :usuario.especialidad
     });
    }
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
