import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/clases/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  edad! : number;
  dni! : number;
  obraSocial : string = '';
  especialidad : string = '';
  paciente! : Paciente;
  imagenes: string[];
  evento : any;
  formGroup! : FormGroup;

  constructor(public service:AuthService,private firestore : Firestore,
              private router : Router, private storage : Storage,private form : FormBuilder) {
    this.mensaje = '';
    this.imagenes = [];
  }

  ngOnInit(): void {
    this.obtenerImagenes();
    this.formGroup = this.form.group({
      'email':['',[Validators.required]],
      'nombre':['',[Validators.required]],
      'apellido':['',[Validators.required]],
      'edad': ['', [Validators.required, Validators.min(18),Validators.max(99)]],
      'dni': ['',[Validators.required,Validators.min(11111111),Validators.max(99999999),Validators.minLength(8),Validators.minLength(8)]],
      'obraSocial':['',[Validators.required]],
      'Especialista':['',[Validators.required]],
      'Password':['',[Validators.required]],
    });
  }

  register(){
    //console.log(this.formGroup.getRawValue());
    const datosForm = this.formGroup.getRawValue();

    var date = new Date();
    this.paciente = new Paciente();
    this.paciente.nombre = this.nombre;
    this.paciente.apellido = this.apellido;
    this.paciente.edad = this.edad;
    this.paciente.dni = this.dni;
    this.paciente.email = this.email;

    console.log(this.paciente);

    this.service.register(this.paciente,this.clave).then((userCredential) => {
      console.log("registrado exitosamente");

      const col = collection(this.firestore,'Usuarios');
      addDoc(col,{
        nombre : this.paciente.nombre,
        apellido : this.paciente.apellido,
        edad : this.paciente.edad,
        dni : this.paciente.dni,
        email : this.paciente.email,
        tipo : "paciente"
      });
      userCredential.user?.updateProfile({displayName: this.nombre})
      this.router.navigate(['home']);

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
    this.tipo = "Especialista";
  }

  fillPaciente(){
    this.email  = 'montreal95@hotmail.es';
    this.clave  = '123123123';
    this.nombre  = 'rodo';
    this.apellido = 'solari';
    this.edad = 28;
    this.dni= 39252151;
    this.formGroup.setValue({
      email: this.email,
      nombre: this.nombre,
      apellido: this.apellido,
      edad: 28,
      dni:39252151,
      Password:this.clave ,
      obraSocial:null,
      Especialista: null
    });
   // this.formGroup.('nombre').value = this.email;
  }

  ObtenerImagen($event: any) {
    this.evento = $event;
    /*console.log("Subiendo imagen");
    const file = $event.target.files[0];
    //const file = $event.target.files;
    console.log(file);

    const imgRef = ref(this.storage, `imagenes/${file.name}`);

    uploadBytes(imgRef, file)
      .then(response => {
        console.log(response)
        this.obtenerImagenes();
      })
      .catch(error => console.log(error));*/

  }

  Subir(){
    console.log("Subiendo imagen");
    const file = this.evento.target.files[0];
    //const file = $event.target.files;
    console.log(file);

    const imgRef = ref(this.storage, `imagenes/${file.name}`);

    uploadBytes(imgRef, file)
      .then(response => {
        console.log(response)
        this.obtenerImagenes();
      })
      .catch(error => console.log(error));
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
