import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HistoriaClinicaService } from 'src/app/services/historia-clinica.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent {
  usuario: any;
  historiaClinica: any[] = [];
  userData: any;
  especialidades: string[] = [];
  especialidadesString: string = '';
  horarios: any = {};
  diasSemana: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  horasDisponibles: string[] = [];
  horasDisponiblesSabado: string[] = [];
  nuevaDisponibilidad: any = {
    especialidad: '',
    dia: '',
    horarioInicio: '',
    horarioFin: ''
  };
  horariosDisponibles: any[] = [];
  mostrarModalHistoriaClinica: boolean = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private storage: AngularFireStorage,
    private historiaClinicaService: HistoriaClinicaService
  ) {}

  ngOnInit(): void {
    this.authService.userLogged().subscribe(user => {
      if (user && user.email) {
        this.cargarDatosUsuario(user.email);
        console.log("Historia: " + this.historiaClinica);
      }
    });
    this.generarHorasDisponibles();
    this.generarHorasDisponiblesSabado();
  }

  cargarHistoriaClinica(): void {
    if (this.userData && this.userData.email) {
      this.historiaClinicaService.obtenerHistoriaClinica(this.userData.email).subscribe((historiaClinica: any[]) => {
        this.historiaClinica = historiaClinica;
      });
    }
  }

  abrirModalHistoriaClinica(): void {
    this.mostrarModalHistoriaClinica = true;
  }

  cerrarModalHistoriaClinica(): void {
    this.mostrarModalHistoriaClinica = false;
  }

  cargarDatosUsuario(email: string): void {
    this.authService.obtenerDatosUsuario(email).then(data => {

      this.userData = data;

      this.especialidades = [data.especialidad, data.especialidad2].filter(e => e);
      this.especialidadesString = this.especialidades.join(', ');

      // Inicializar los horarios
      this.especialidades.forEach(especialidad => {
        this.horarios[especialidad] = {};
        this.diasSemana.forEach(dia => {
          this.horarios[especialidad][dia] = { activo: false, inicio: '', fin: '' };
        });
      });

      // Cargar los horarios disponibles del usuario
      if (data.horariosDisponibles) {
        data.horariosDisponibles.forEach((horario: any) => {
          if (this.horarios[horario.especialidad]) {
            this.horarios[horario.especialidad][horario.dia] = {
              activo: true,
              inicio: horario.horarioInicio,
              fin: horario.horarioFin
            };
          }
        });
      }

      if(this.userData.tipo =='paciente'){
        this.cargarHistoriaClinica();
      }

    }).catch(error => {
      console.error("Error al cargar los datos del usuario: ", error);
    });
  }

  generarHorasDisponibles(): void {
    const horarios = [];
    let horaActual = new Date();
    horaActual.setHours(8, 0, 0, 0);
    const horaFin = new Date();
    horaFin.setHours(19, 0, 0, 0);

    while (horaActual <= horaFin) {
      const horas = horaActual.getHours().toString().padStart(2, '0');
      const minutos = horaActual.getMinutes().toString().padStart(2, '0');
      if (minutos === '00' || minutos === '30') {
        horarios.push(`${horas}:${minutos}`);
      }
      horaActual.setMinutes(horaActual.getMinutes() + 30);
    }

    this.horasDisponibles = horarios;
  }

  generarHorasDisponiblesSabado(): void {
    const horarios = [];
    let horaActual = new Date();
    horaActual.setHours(8, 0, 0, 0);
    const horaFin = new Date();
    horaFin.setHours(14, 0, 0, 0);

    while (horaActual <= horaFin) {
      const horas = horaActual.getHours().toString().padStart(2, '0');
      const minutos = horaActual.getMinutes().toString().padStart(2, '0');
      if (minutos === '00' || minutos === '30') {
        horarios.push(`${horas}:${minutos}`);
      }
      horaActual.setMinutes(horaActual.getMinutes() + 30);
    }

    this.horasDisponiblesSabado = horarios;
  }

  toggleDia(especialidad: string, dia: string): void {
    this.horarios[especialidad][dia].activo = !this.horarios[especialidad][dia].activo;
  }

  isDiaActivo(especialidad: string, dia: string): boolean {
    return this.horarios[especialidad][dia].activo;
  }

  actualizarPerfil(): void {
    if (this.userData.perfil === 'especialista') {
      const especialidades = this.especialidadesString.split(',').map((especialidad: string) => especialidad.trim());
      this.userData.especialidad = especialidades[0] || '';
      this.userData.especialidad2 = especialidades[1] || '';
    }

    // Guardar horarios disponibles
    this.userData.horariosDisponibles = [];
    let horariosValidos = true;
    this.especialidades.forEach(especialidad => {
      this.diasSemana.forEach(dia => {
        const inicio = this.horarios[especialidad][dia].inicio;
        const fin = this.horarios[especialidad][dia].fin;
        if (this.horarios[especialidad][dia].activo) {
          if (this.validarHorarios(inicio, fin)) {
            this.userData.horariosDisponibles.push({
              especialidad,
              dia,
              horarioInicio: inicio,
              horarioFin: fin
            });
          } else {
            horariosValidos = false;
          }
        }
      });
    });

    if (horariosValidos) {
      this.usuarioService.actualizarDatosUsuario(this.userData).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'El perfil ha sido actualizado exitosamente.'
        });
      }).catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el perfil. Por favor, inténtalo de nuevo.'
        });
        console.error('Error al actualizar el perfil: ', error);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en horarios',
        text: 'El horario de inicio debe ser menor que el horario de fin.'
      });
    }
  }

  validarHorarios(inicio: string, fin: string): boolean {
    if (!inicio || !fin) return false;
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFin, minutoFin] = fin.split(':').map(Number);
    if (horaInicio > horaFin || (horaInicio === horaFin && minutoInicio >= minutoFin)) {
      return false;
    }
    return true;
  }

  cargarImagen(event: any, imagenKey: string): void {
    const file = event.target.files[0];
    const filePath = `usuarios/${this.userData.email}/${imagenKey}.jpg`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.userData[imagenKey] = url;
          Swal.fire({
            icon: 'success',
            title: 'Imagen actualizada',
            text: 'La imagen ha sido actualizada exitosamente.'
          });
        });
      })
    ).subscribe();
  }

  clickImagen(imagenKey: string): void {
    const input = document.getElementById(imagenKey) as HTMLInputElement;
    input.click();
  }
}
