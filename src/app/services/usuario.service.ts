import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore,collection, collectionData  } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestore : Firestore, private auth : AngularFireAuth) { }

  traerUsuario(){

  }

  traerTodos(){
    const col = collection(this.firestore,'Usuarios');
    const observable = collectionData(col);
    return observable;
  }

 /* traerEspecialistasNoVerificadosPorAdmin(){

  }*/
}
