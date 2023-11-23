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
  especialidad : string = '';
  edad : number = 0;
  dni : number = 0;
  otraEspecialidad! : boolean;
  nuevaEspecialidad : string = '';
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
 // nuevaEspecialidad! : string;

  constructor(public service:AuthService,private router : Router, private storage : Storage,
              private form : FormBuilder, usuarioService : UsuarioService) {
    this.mensaje = '';
    this.imagenes = [];
  }

  ngOnInit(): void {

    this.obtenerImagenes();
      this.formGroup = this.form.group({
        'email':['',[Validators.required]],
        'nombre':['',[Validators.required]],
        'apellido':['',[Validators.required]],
        'edad': ['', [Validators.required, Validators.min(1),Validators.max(99)]],
        'obraSocial':['',[Validators.required]],
        'especialidad':['',[Validators.required]],
        'dni': ['',[Validators.required,Validators.min(11111111),Validators.max(99999999),Validators.minLength(8),Validators.minLength(8)]],
        'password':['',[Validators.required]],
        'imagen1':['',[Validators.required]],
        'imagen2':['',],
      });
      this.especialidad = this.formGroup.getRawValue().especialidad;
    this.service.traerEspecialidaes().subscribe((respuesta) => {
      this.especialidades = respuesta;
    })
  }

  register(){
    const datosForm = this.formGroup.getRawValue();
    var date = new Date();
    this.service.register(datosForm.email,datosForm.password).then((userCredential) => {
      this.service.confirmarMail(userCredential.user);

      this.service.subirLog(datosForm.email,date.toLocaleString());
      setTimeout(() => {
        this.service.addPaciente(datosForm,this.tipo);
      }, 400);
      this.Subir();
      userCredential.user?.updateProfile({displayName: datosForm.nombre});
      this.service.logout();
      this.router.navigate(['home']);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      this.mensaje = error.message.slice(9);
    });

  }

  onEspecialidadChange(event: any) {
    this.especialidad = event.target.value;
  }

  showMessage(){
    this.mensaje = "El usuario que desea registrar ya existe, por favor vuelva a ingresar otros datos";
  }

  mostrarFormPaciente(){
    this.tipo = "paciente";
    this.formGroup.patchValue({
      especialidad: false
    });
  }

  mostrarFormEspecialista(){
    this.tipo = "especialista";
    this.formGroup.patchValue({
      obraSocial: false
    });

  }

  opcionEspecialidadNueva(){
    this.otraEspecialidad = true;
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
    console.log("Subiendo imagen");
    //const file = this.evento.target.files[0];
    const imgRef = ref(this.storage, `imagenes/${this.imagen1.name}`);
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
