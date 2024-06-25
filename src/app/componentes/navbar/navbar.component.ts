import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  usuariologeado: any;
  isAdmin: boolean = false;
  imagenPerfil: string | null = null; // Agregamos una variable para la imagen de perfil
  isPaciente: boolean = false;
  isEspecialista: boolean = false;

  constructor(
    public service: AuthService,
    private router: Router,
    public firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.service.userLogged().subscribe(async usuario => {
      if (usuario && usuario.email) {
        try {
          const userData = await this.service.obtenerDatosUsuario(usuario.email);
          //console.log('Datos del usuario en navbar:', userData);
          //if (userData){
            if((userData.tipo === 'especialista' && userData.estadoAprobadoPorAdmin && usuario.emailVerified) ||
                (userData.tipo === 'paciente' && usuario.emailVerified) ||
                userData.tipo === 'administrador'){
                  this.usuariologeado = usuario;
                  this.isAdmin = userData.tipo === 'administrador';
                  this.isPaciente = userData.tipo === 'paciente';
                  this.isEspecialista = userData.tipo === 'especialista';
                  this.imagenPerfil = userData.imagen1; // Usamos imagen1 como la imagen de perfil
            }else{
              console.warn('El usuario no cumple con los requisitos de inicio de sesión.');
              /*await this.logout();
              this.usuariologeado = null;
              this.router.navigate(['home']);*/
            }
         // } else {
         //   console.error('No se encontraron datos del usuario.');
            /*await this.logout();
            this.usuariologeado = null;
            this.router.navigate(['home']);*/
         // }
        } catch (error) {
          console.error('Error obteniendo los datos del usuario en navbar:', error);
          /*await this.service.logout();
          this.usuariologeado = null;*/
          //this.router.navigate(['home']);
        }
      } else {
        this.usuariologeado = null;
        this.router.navigate(['home']);
      }
    });
  }

  async logout() {
    console.log("cerrando sesion..");
    await this.service.logout();
    this.router.navigate(['home']);
  }
}
