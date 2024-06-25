import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent {
  userData: any;
  horariosDisponibles: any[] = [];
  especialidades: string[] = [];
  especialidadSeleccionada: string = '';
  horarioInicio: string = '';
  horarioFin: string = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private turnosService : TurnosService
  ) { }

  ngOnInit(): void {
    this.authService.userLogged().subscribe(user => {
      if (user) {
        this.userData = user;
        this.cargarDatosUsuario();
      }
    });
  }

  cargarDatosUsuario() {
      this.userData  = this.authService.obtenerDatosUsuario(this.userData.email)
      this.especialidades = this.userData.especialidades || [];
      this.horariosDisponibles = this.userData.horariosDisponibles || [];

  }

  agregarDisponibilidad() {
    if (this.especialidadSeleccionada && this.horarioInicio && this.horarioFin) {
      const nuevaDisponibilidad = {
        especialidad: this.especialidadSeleccionada,
        horarioInicio: this.horarioInicio,
        horarioFin: this.horarioFin
      };
      this.horariosDisponibles.push(nuevaDisponibilidad);
    /*  this.turnosService.actualizarHorariosDisponibles(this.userData.email, this.horariosDisponibles).then(() => {
        this.especialidadSeleccionada = '';
        this.horarioInicio = '';
        this.horarioFin = '';
      });*/
    }
  }
}
