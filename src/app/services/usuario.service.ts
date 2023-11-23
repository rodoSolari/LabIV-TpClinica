import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore,collection, collectionData, deleteDoc, doc  } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestore : Firestore, private auth : AngularFireAuth, private angularFirestore : AngularFirestore) { }

  traerUsuario(){

  }

  /*traerTodos(){
    const col = collection(this.firestore,'Usuarios');
    const observable = collectionData(col);

    return observable;
  }*/

  traerTodos() {
      return this.angularFirestore.collection('Usuarios').snapshotChanges();
  }

  delete(id : string) {
      return this.angularFirestore.collection('Usuarios').doc(id).delete();
  }

  eliminar(id : string){
    const col = collection(this.firestore,'Usuarios');
    const documento = doc(col,id);
    deleteDoc(documento);
  }
}
