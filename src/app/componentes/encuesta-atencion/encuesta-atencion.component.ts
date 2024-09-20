import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxStarRatingModule } from 'ngx-star-rating';

@Component({
  selector: 'app-encuesta-atencion',
  templateUrl: './encuesta-atencion.component.html',
  styleUrls: ['./encuesta-atencion.component.scss']
})
export class EncuestaAtencionComponent {
  encuestaForm!: FormGroup;

  constructor(private fb: FormBuilder, private usuariosService: UsuarioService) {}

  ngOnInit(): void {
    this.encuestaForm = this.fb.group({
      comentario: ['', Validators.required],
      calificacion: [0, Validators.required],
      satisfaccion: this.fb.group({
        respuesta: ['',Validators.required]
      }),
      puntualidad: [false],
      empatia: [false],
      tiempo_espera: [0]
    });

    this.cargarEncuestasUltimos30Dias();
  }

  async onSubmit(): Promise<void> {
    if (this.encuestaForm.valid) {
      try {
        await this.usuariosService.agregarEncuesta(this.encuestaForm.value);
        Swal.fire({
          icon: 'success',
          title: 'Encuesta enviada',
          text: 'La encuesta se ha enviado exitosamente.'
        });
      } catch (error) {
        console.error('Error al enviar la encuesta:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al Enviar encuesta. Por favor, inténtalo de nuevo.'
        });
      }
    }
    this.encuestaForm.reset();
  }

  async cargarEncuestasUltimos30Dias(): Promise<void> {
    try {
      const encuestas = await this.usuariosService.obtenerEncuestasUltimos30Dias();
      console.log('Encuestas de los últimos 30 días:', encuestas);
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
    }
  }
}
