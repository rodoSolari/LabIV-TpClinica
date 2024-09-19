import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      comentario: [''],
      calificacion: [0],
      satisfaccion: this.fb.group({
        respuesta: ['']
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
      } catch (error) {
        console.error('Error al enviar la encuesta:', error);
      }
    }
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
