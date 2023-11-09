import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { getStorage, ref } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class StorageService {



  constructor(private storage : Storage) { }

  SubirImagen(){}

  ObtenerImagenes(){}
}
