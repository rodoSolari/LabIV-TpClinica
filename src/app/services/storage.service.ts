import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { getStorage, ref } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class StorageService {



  constructor() { }

/*
  async subirImagen(nombre: string, imgBase64: any) {
    const storage = this.storage.
// Create a child reference
    const imagesRef = ref()
    // imagesRef now points to 'images'

    // Child references can also take paths delimited by '/'
    const spaceRef = ref(storage, 'images/space.jpg');


    try {
      let respuesta = await this.storareRef.child("users/" + nombre).putString(imgBase64, 'data_url');
      console.log(respuesta);
      return await respuesta.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return null;
    }

  }*/
}
