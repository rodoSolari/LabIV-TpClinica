import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta-atencion',
  templateUrl: './encuesta-atencion.component.html',
  styleUrls: ['./encuesta-atencion.component.scss']
})
export class EncuestaAtencionComponent {
  encuesta = {
    comentarios: '',
    calificacion: 0,
    recomendacion: '',
    mejoras: {
      atencion: false,
      servicio: false,
      instalaciones: false,
    },
    satisfaccion: 5
  };

  stars = [1, 2, 3, 4, 5];

  constructor(private usuarioService: UsuarioService) {}

  submitEncuesta() {
    console.log('Encuesta enviada:', this.encuesta);

    this.usuarioService.guardarEncuesta(this.encuesta)
      .then(() => {
        Swal.fire({
          title: '¡Encuesta enviada!',
          text: 'Gracias por completar la encuesta.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      })
      .catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar la encuesta. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  }
}
