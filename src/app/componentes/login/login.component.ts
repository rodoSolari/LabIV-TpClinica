import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  date = new Date();
  email : string = '';
  clave : string = '';
  mensaje : string = ''

  constructor(public service : AuthService, private router : Router, private auth : AngularFireAuth) {}

  ngOnInit(): void {

  }

  login(){
    this.service.login(this.email,this.clave).then((userCredential) => {
     /* this.auth.authState.subscribe((usuario : any) =>{
       if(usuario. usuario.tipo = 'paciente')
      })*/
      const date : Date = new Date();
      this.service.subirLog(this.email,date.toLocaleString());
      console.log("usuario logueado correctamente");

      this.router.navigate(['home']);
    })
    .catch((error) => {
      this.mensaje = error.message.slice(9);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  fillUserData(){
    this.email = "usuarioprueba@hotmail.com"
    this.clave = "prueba123";
  }

  fillUserDataEspecialista(){
    this.email = "especialistaprueba@hotmail.com"
    this.clave = "especialista123";
  }
}
