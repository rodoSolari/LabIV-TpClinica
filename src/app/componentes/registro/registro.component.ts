import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/clases/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  formGroup: FormGroup;
  especialidades: string[] = [];
  tipo: string = '';
  mensaje: string = '';
  siteKey : string = '6LegtgAqAAAAAMlArl43xxDmD7G3Ub9txQ78_hH1';
  loading: boolean = false;
  captchaHabilitado = false;
  generatedCaptcha: string = '';
  captchaTextoIngresado = '';
  mostrarEspecialidad2 = false; //

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,

  ) {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      especialidad: [''],
      obraSocial: [''],
      nuevaEspecialidad:[''],
      imagen1: [null, Validators.required],
      imagen2: [null],
      recaptcha: ['', Validators.required],
      captcha: ['']
    });
  }

  ngOnInit(): void {

    this.usuarioService.traerEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });


  }



  handleCaptcha(captchaText: string) {
    console.log('Generated Captcha: ', captchaText);
    this.generatedCaptcha = captchaText;
  }

  toggleCaptcha() {
    this.captchaHabilitado = !this.captchaHabilitado;
    if (!this.captchaHabilitado) {
      this.formGroup.get('captcha')?.reset();
      this.formGroup.get('captcha')?.clearValidators();
    } else {
      this.formGroup.get('captcha')?.setValidators([Validators.required]);
    }
    this.formGroup.get('captcha')?.updateValueAndValidity();
  }


  onEspecialidadChange(event: any): void {
    if (event.target.value === 'otro') {
      this.formGroup.get('nuevaEspecialidad')?.setValidators([Validators.required, this.existingEspecialidadValidator.bind(this)]);
      this.formGroup.get('nuevaEspecialidad')?.updateValueAndValidity();
    } else {
      this.formGroup.get('nuevaEspecialidad')?.clearValidators();
      this.formGroup.get('nuevaEspecialidad')?.updateValueAndValidity();
    }
  }

  existingEspecialidadValidator(control: AbstractControl): { [key: string]: any } | null {
    return this.especialidades.includes(control.value) ? { 'especialidadExistente': true } : null;
  }

  validateEspecialidad(): void {
    const nuevaEspecialidadControl = this.formGroup.get('nuevaEspecialidad');
    if (nuevaEspecialidadControl) {
      nuevaEspecialidadControl.updateValueAndValidity();
    }
  }

  register(): void {
    console.log('Generated Captcha in register: ', this.generatedCaptcha);
    if (this.captchaHabilitado && this.captchaTextoIngresado !== this.generatedCaptcha) {
      Swal.fire('Error', 'Captcha Incorrecto', 'error');
      return;
    } else {



    this.loading = true;
    const { email, password, nombre, apellido, edad, dni, obraSocial, especialidad } = this.formGroup.value;
    const tipo = this.tipo;
    const imagen1 = this.formGroup.get('imagen1')?.value;
    const imagen2 = this.formGroup.get('imagen2')?.value;
    const usuarioData = { email, password, nombre, apellido, edad, dni, obraSocial, especialidad, tipo };

    this.authService.register(email, password).then(userCredential => {
      const uid = userCredential.user?.uid;
        if (tipo === 'paciente') {
          this.usuarioService.addPaciente(usuarioData, imagen1, imagen2, uid!).then(() => {
            this.authService.confirmarMail(userCredential.user).then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Paciente registrado exitosamente',
                text: ' Por favor, verifique su correo electrónico.'
              });
              this.limpiarFormulario();
              this.loading = false;
            }).catch((error: any) => {
              this.mensaje = 'Error al enviar el correo de verificación: ' + error.message;
              this.loading = false;
            });
          }).catch((error: any) => {
            this.mensaje = 'Error al registrar el paciente: ' + error.message;
            this.loading = false;
          });
        } else if (tipo === 'especialista') {
          if (especialidad === 'otro') {
            usuarioData.especialidad = this.formGroup.get('nuevaEspecialidad')?.value;
            this.usuarioService.agregarEspecialidad(usuarioData.especialidad);
          }
          this.usuarioService.addEspecialista(usuarioData, imagen1, uid!).then(() => {
            this.authService.confirmarMail(userCredential.user).then(() => {
              //this.mensaje = 'Especialista registrado exitosamente. ';
              Swal.fire({
                icon: 'success',
                title: 'Especialista registrado exitosamente',
                text: 'Por favor, verifique su correo electrónico, luego aguarde a que su cuenta sea aprobada por un administrador.'
              });
              this.limpiarFormulario();
              this.loading = false;
            }).catch((error: any) => {
              this.mensaje = 'Error al enviar el correo de verificación: ' + error.message;
              this.loading = false;
            });
          }).catch((error: any) => {
            this.mensaje = 'Error al registrar el especialista: ' + error.message;
            this.loading = false;
          });
        }
    }).catch((error: any) => {
      this.mensaje = 'Error al registrar el usuario: ' + error.message;
      this.loading = false;
    });
    }
  }

  limpiarFormulario(): void {
    this.formGroup.reset();
    for (let control in this.formGroup.controls) {
      this.formGroup.get(control)?.setErrors(null);
    }
  }

  cargarImagen1(event: any): void {
    const file = event.target.files[0];
    this.formGroup.patchValue({
      imagen1: file
    });
  }

  cargarImagen2(event: any): void {
    const file = event.target.files[0];
    this.formGroup.patchValue({
      imagen2: file
    });
  }
agregarEspecialidad2() {
    const especialidad2 = this.formGroup.get('especialidad2')?.value;
    if (especialidad2) {
      this.usuarioService.verificarEspecialidad(especialidad2).subscribe(existe => {
        if (existe) {
          alert('La especialidad ya existe.');
        } else {
          this.mostrarEspecialidad2 = true;
        }
      });
    } else {
      this.mostrarEspecialidad2 = true;
    }
  }

}
