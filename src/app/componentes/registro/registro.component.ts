import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/clases/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import {BotonesDirective} from '../../directivas/botones.directive'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  date = new Date();
  tipo : string = '';
  mensaje : string;
  email : string = '';
  clave : string = '';
  nombre : string = '';
  apellido : string = '';
  edad : number = 0;
  dni : number = 0;
  estadoAprobado! : boolean;
  estadoAprobadoPorAdmin! : boolean;
  obraSocial : string = '';
  especialidades : any[] = [];
  paciente! : Paciente;
  imagenes : any[];
  imagen1: any;
  imagen2: any;
  evento : any;
  formGroup! : FormGroup;
  check! : boolean;
  nuevaEspecialidad! : string;

  constructor(public service:AuthService,private firestore : Firestore,
              private router : Router, private storage : Storage,
              private form : FormBuilder, usuarioService : UsuarioService) {
    this.mensaje = '';
    this.imagenes = [];
  }

  ngOnInit(): void {
    console.log("tipo =" +this.tipo);
    this.obtenerImagenes();
    this.formGroup = this.form.group({
      'email':['',[Validators.required]],
      'nombre':['',[Validators.required]],
      'apellido':['',[Validators.required]],
      'edad': ['', [Validators.required, Validators.min(18),Validators.max(99)]],
      'dni': ['',[Validators.required,Validators.min(11111111),Validators.max(99999999),Validators.minLength(8),Validators.minLength(8)]],/*
      'obraSocial':['',[Validators.required]],
      'especialista':['',[Validators.required]],*/
      'password':['',[Validators.required]],
      /*'imagen1':['',[Validators.required]],
      'imagen2':['',[Validators.required]]*/
    });

    this.service.traerEspecialidaes().subscribe((respuesta) => {
      this.especialidades = respuesta;
     // console.log("especialidades " + respuesta);
    })


  }

  register(){
    const datosForm = this.formGroup.getRawValue();
    var date = new Date();
    console.log(datosForm.email + "  "+datosForm.password);
    this.service.register(datosForm.email,datosForm.password).then((userCredential) => {
      this.service.confirmarMail(userCredential.user);

      console.log("registrado exitosamente, se envio mail de confirmacion");
      this.service.subirLog(datosForm.email,date.toLocaleString());
      setTimeout(() => {
        const col = collection(this.firestore,'Usuarios');
        this.service.addPaciente(datosForm);
      }, 200);
      this.Subir();
      userCredential.user?.updateProfile({displayName: datosForm.nombre})
      this.router.navigate(['home']);
      this.service.logout();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      this.mensaje = error.message.slice(9);
    });

  }

  showMessage(){
      this.mensaje = "El usuario que desea registrar ya existe, por favor vuelva a ingresar otros datos";
  }

  mostrarFormPaciente(){
    this.tipo = "paciente";
  }

  mostrarFormEspecialista(){
    this.tipo = "especialista";
  }

  agregarNuevaEspecialidad(){
    /*if(!this.especialidades.includes(this.nuevaEspecialidad)){
      this.service.agregarEspecialidad(this.nuevaEspecialidad).subscribe((respuesta : any) =>{
        console.log(respuesta);
      });
    }*/
  }


  cargarImagen1(event: any) {
    this.imagen1 = event.target.files[0];
    console.log("Primera imagen: " + this.imagen1);
  }

  cargarImagen2($event: any) {
    this.imagen2 = $event.target.files[0];
    console.log("Segunda imagen: " + this.imagen2);
  }

  Subir(){
    var nombreCarpeta : string = this.tipo = 'paciente' ? 'especialista/' : 'imagenes/';

    console.log("Subiendo imagen");
    //const file = this.evento.target.files[0];
    const imgRef = ref(this.storage, `${nombreCarpeta}${this.imagen1.name}`);
    uploadBytes(imgRef, this.imagen1)
      .then(response => {
        console.log(response)
        this.obtenerImagenes();
      })
      .catch(error => console.log(error));
    if(this.tipo == 'paciente'){
      const imgRef2 = ref(this.storage, `imagenes/${this.imagen2.name}`);
      uploadBytes(imgRef2, this.imagen2)
        .then(response => {
          console.log(response)
          this.obtenerImagenes();
        })
        .catch(error => console.log(error));
    }
  }

  obtenerImagenes() {
    const imagesRef = ref(this.storage, 'imagenes');

    listAll(imagesRef)
      .then(async response => {
        console.log(response);
        this.imagenes = [];
        for (let item of response.items) {
          const url = await getDownloadURL(item);
          this.imagenes.push(url);
        }
      })
      .catch(error => console.log(error));
  }

}
