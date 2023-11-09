import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public service : AuthService, private router : Router) {}

  usuariologeado : any;

  ngOnInit(): void {
    this.service.userLogged().subscribe(usuario => {
      this.usuariologeado = usuario;
    });
  }

  public userIsLogged(){
    // return this.service.userLogged();
  }

  logout(){
    console.log("cerrando sesion..");
    this.service.logout();
    this.router.navigate(['home']);

  }
}
