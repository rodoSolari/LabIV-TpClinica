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
  email: string = '';
  clave: string = '';
  mensaje: string = '';

  constructor(public service: AuthService, private router: Router, private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  login() {
    this.service.login(this.email, this.clave).then((userCredential) => {
      const date: Date = new Date();
      this.service.subirLog(this.email, date.toLocaleString());
      console.log("usuario logueado correctamente");
      this.router.navigate(['home']);
    }).catch((error) => {
      let mensajeError: string;
      switch (error.code) {
        case 'especialista/no-aprobado':
          mensajeError = error.message;
          break;
        case 'paciente/no-verificado':
          mensajeError = error.message;
          break;
        case 'usuario/no-encontrado':
          mensajeError = error.message;
          break;
        case 'auth/invalid-email':
          mensajeError = 'El correo electrónico proporcionado no es válido.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-login-credentials':
          mensajeError = 'Credenciales de inicio de sesión incorrectas. Por favor, verifica tus datos.';
          break;
        default:
          mensajeError = 'Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.';
          break;
      }
      this.mensaje = mensajeError;
      console.error('Error de inicio de sesión:', error);
    });
  }


  fillUserData() {
    this.email = "beilubruffeutrei-5383@yopmail.com";
    this.clave = "123123";
  }

  fillUserDataEspecialista() {
    this.email = "wanneugoihoka-1312@yopmail.com";
    this.clave = "123123";
  }

  fillUserDataAdmin() {
    this.email = "adminprueba@hotmail.com";
    this.clave = "admin123";
  }
}
