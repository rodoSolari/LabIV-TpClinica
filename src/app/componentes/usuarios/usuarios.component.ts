import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit{
  adminFormGroup: FormGroup;
  pacienteFormGroup: FormGroup;
  listadoEspecialistas: any[] = [];
  listadoAdministradores: any[] = [];
  mensajeAdmin: string = '';
  mensajePaciente: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private storage: AngularFireStorage
  ) {
    this.adminFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.pacienteFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      obraSocial: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen1: [null, Validators.required],
      imagen2: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.traerUsuarios().subscribe((usuarios: any[]) => {
      this.listadoEspecialistas = usuarios.filter(usuario => usuario.tipo === 'especialista');
      this.listadoAdministradores = usuarios.filter(usuario => usuario.tipo === 'administrador');
    });
  }

  aceptar(especialista: any): void {
    this.usuarioService.habilitarEspecialista(especialista.id).then(() => {
      this.cargarUsuarios();
    });
  }

  cancelar(id: string): void {
    this.usuarioService.eliminar(id).then(() => {
      this.cargarUsuarios();
    });
  }

  registrarAdmin(): void {
    const { email, password, nombre, apellido, edad, dni } = this.adminFormGroup.value;
    const adminData = { email, password, nombre, apellido, edad, dni, tipo: 'administrador' };

    this.authService.addAdmin(adminData).then(() => {
      this.mensajeAdmin = 'Administrador registrado exitosamente.';
      this.limpiarFormulario(this.adminFormGroup);
      this.cargarUsuarios();
    }).catch(error => {
      this.mensajeAdmin = error.message;
    });
  }

  registrarPaciente(): void {
    const { email, password, nombre, apellido, edad, dni, obraSocial } = this.pacienteFormGroup.value;


    const imagen1 = this.pacienteFormGroup.get('imagen1')?.value;
    const imagen2 = this.pacienteFormGroup.get('imagen2')?.value;

    const pacienteData = {
      email,
      password,
      nombre,
      apellido,
      edad,
      dni,
      obraSocial,
      especialidad: '',
      tipo: 'paciente',
      imagen1: '',
      imagen2: ''
    };

    const auth = getAuth();
    const adminUser = auth.currentUser; // Guardar el usuario administrador actual

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;

        const filePath1 = `usuarios/${uid}/${imagen1.name}`;
        const fileRef1 = this.storage.ref(filePath1);
        const uploadTask1 = this.storage.upload(filePath1, imagen1);

        uploadTask1.snapshotChanges().pipe(
          finalize(() => {
            fileRef1.getDownloadURL().subscribe((url1: string) => {

              const filePath2 = `usuarios/${uid}/${imagen2.name}`;
              const fileRef2 = this.storage.ref(filePath2);
              const uploadTask2 = this.storage.upload(filePath2, imagen2);

              uploadTask2.snapshotChanges().pipe(
                finalize(() => {
                  fileRef2.getDownloadURL().subscribe((url2: string) => {

                    pacienteData.imagen1 = url1;
                    pacienteData.imagen2 = url2;

                    this.usuarioService.addPaciente(pacienteData, imagen1, imagen2, uid).then(() => {
                      this.mensajePaciente = 'Paciente registrado exitosamente.';
                      this.limpiarFormulario(this.pacienteFormGroup);

                      // Volver a loguear al usuario administrador
                      if (adminUser) {
                        auth.updateCurrentUser(adminUser).then(() => {
                          console.log("Administrador logueado nuevamente.");
                        }).catch((error) => {
                          console.error("Error al loguear nuevamente al administrador:", error);
                        });
                      }
                    }).catch(error => {
                      this.mensajePaciente = 'Error al registrar el paciente: ' + error.message;
                    });
                  });
                })
              ).subscribe();
            });
          })
        ).subscribe();
      })
      .catch(error => {
        this.mensajePaciente = 'Error al registrar el paciente: ' + error.message;
      });
  }

  limpiarFormulario(form: FormGroup): void {
    form.reset();
    for (let control in form.controls) {
      form.get(control)?.setErrors(null);
    }
  }

  cargarImagen1(event: any): void {
    const file = event.target.files[0];
    this.pacienteFormGroup.patchValue({
      imagen1: file
    });
  }

  cargarImagen2(event: any): void {
    const file = event.target.files[0];
    this.pacienteFormGroup.patchValue({
      imagen2: file
    });
  }
}
