import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.userLogged().pipe(
      switchMap(user => {
        if (user) {
          return from(this.authService.obtenerDatosUsuario(user.email!)).pipe(
            map(userData => {
              if (userData && userData.tipo === 'administrador') {
                return true;
              } else {
                return this.router.parseUrl('home');
              }
            })
          );
        } else {
          return [this.router.parseUrl('home')];
        }
      })
    );
  }
}
