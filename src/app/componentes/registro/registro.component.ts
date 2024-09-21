import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/clases/paciente';
import { AuthService } from 'src/app/services/auth.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  formGroup!: FormGroup;
  especialidades: string[] = [];
  tipo: string = '';
  mensaje: string = '';
  siteKey : string = '6LegtgAqAAAAAMlArl43xxDmD7G3Ub9txQ78_hH1';
  loading: boolean = false;
  captchaHabilitado = false;
  generatedCaptcha: string = '';
  captchaTextoIngresado = '';
  mostrarEspecialidad2 = false; //
  especialidadesSeleccionadas: string[] = [];
  mostrarNuevaEspecialidad = false;

  constructor(private fb: FormBuilder,private authService: AuthService,private usuarioService: UsuarioService) {
    this.crearFormularioInicial();
  }

  ngOnInit(): void {

    this.usuarioService.traerEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
      //console.log(this.especialidades)
    });
  }

  crearFormularioInicial(): void {
    this.formGroup = this.fb.group({});
  }

  crearFormulario(): void {
    if (this.tipo === 'paciente') {
      this.formGroup = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
        dni: ['', [Validators.required, this.dniLengthValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        obraSocial: ['', Validators.required],
        imagen1: [null, Validators.required],
        imagen2: [null,Validators.required],
        recaptcha: ['', Validators.required],
        captcha: ['']
      });
    } else if (this.tipo === 'especialista') {
      this.formGroup = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
        dni: ['', [Validators.required, this.dniLengthValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        especialidades: ['', [Validators.required, this.maxTwoSelectedValidator]],
        nuevaEspecialidad: [''],
        imagen1: [null, Validators.required],
        recaptcha: ['', Validators.required],
        captcha: ['']
      });
    }
  }

  seleccionarTipoUsuario(tipo: string): void {
    this.tipo = tipo;
    this.limpiarFormulario();
  }


  handleCaptcha(captchaText: string) {
   // console.log('Generated Captcha: ', captchaText);
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

  toggleEspecialidad(especialidad: string) {
    const index = this.especialidadesSeleccionadas.indexOf(especialidad);
    if (index >= 0) {
      // Si ya está seleccionada, la removemos
      this.especialidadesSeleccionadas.splice(index, 1);
      if (especialidad === 'otro') {
        this.mostrarNuevaEspecialidad = false;
        this.formGroup.get('nuevaEspecialidad')?.setValue('');
      }
    } else {
      this.especialidadesSeleccionadas.push(especialidad);
      if (especialidad === 'otro') {
        this.mostrarNuevaEspecialidad = true;
      }
    }
    this.formGroup.get('especialidades')?.setValue(this.especialidadesSeleccionadas);
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

  maxTwoSelectedValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedEspecialidades = control.value || [];
    return selectedEspecialidades.length > 2 ? { 'maxSelected': true } : null;
  }

  register(): void {
    console.log('Generated Captcha in register: ', this.generatedCaptcha);
    if (this.captchaHabilitado && this.captchaTextoIngresado !== this.generatedCaptcha) {
      Swal.fire('Error', 'Captcha Incorrecto', 'error');
      return;
    } else {

      const formValue = this.formGroup.value;
      const tipoUsuario = this.tipo;

      this.loading = true;
      const { email, password, nombre, apellido, edad, dni, obraSocial, especialidades } = formValue;
      const imagen1 = this.formGroup.get('imagen1')?.value;
      const imagen2 = this.formGroup.get('imagen2')?.value;

      const usuarioData: any = { email, password, nombre, apellido, edad, dni, tipo: tipoUsuario };

      this.authService.register(email, password).then(userCredential => {
        const uid = userCredential.user?.uid;

        if (tipoUsuario === 'paciente') {
          // Registro de paciente
          usuarioData.obraSocial = obraSocial;
          this.usuarioService.addPaciente(usuarioData, imagen1, imagen2, uid!).then(() => {
            this.authService.confirmarMail(userCredential.user).then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Paciente registrado exitosamente',
                text: 'Por favor, verifique su correo electrónico.'
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
        } else if (tipoUsuario === 'especialista') {
          let especialidadesSeleccionadas = especialidades;

          if (especialidadesSeleccionadas.includes('otro')) {
            especialidadesSeleccionadas.push(this.formGroup.get('nuevaEspecialidad')?.value);
            this.usuarioService.agregarEspecialidad(this.formGroup.get('nuevaEspecialidad')?.value); // Agregar nueva especialidad
          }

          usuarioData.especialidad = especialidadesSeleccionadas[0] || '';
          usuarioData.especialidad2 = especialidadesSeleccionadas[1] || '';

          this.usuarioService.addEspecialista(usuarioData, imagen1, uid!).then(() => {
            this.authService.confirmarMail(userCredential.user).then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Especialista registrado exitosamente',
                text: 'Por favor, verifique su correo electrónico, luego aguarde a que su cuenta sea aprobada por un administrador.'
              });
              this.limpiarFormulario();
              this.loading = false;
            }).catch((error: any) => {
              Swal.fire('Error', `Error al enviar el correo de verificación: ${error.message}`, 'error');
              this.loading = false;
            });
          }).catch((error: any) => {
            Swal.fire('Error', `Error al registrar el especialista: ${error.message}`, 'error');
            this.loading = false;
          });
        }
      }).catch((error: any) => {
        Swal.fire('Error', `Error al registrar el usuario: ${error.message}`, 'error');
        this.loading = false;
      });
    }
}

  limpiarFormulario(): void {
    this.formGroup.reset();
    for (let control in this.formGroup.controls) {
      this.formGroup.get(control)?.setErrors(null);
    }
    this.crearFormulario();
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

  dniLengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const dni = control.value;
    if (dni && (dni.toString().length < 7 || dni.toString().length > 8)) {
      return { dniLengthInvalid: true };
    }
    return null;
  }

}
