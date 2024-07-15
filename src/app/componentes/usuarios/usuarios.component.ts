import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import * as XLSX from 'xlsx';
import { TurnosService } from 'src/app/services/turnos.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit{
  adminFormGroup: FormGroup;
  pacienteFormGroup: FormGroup;
  especialistaFormGroup: FormGroup;
  listadoEspecialistas: any[] = [];
  listadoAdministradores: any[] = [];
  listadoPacientes: any[] = [];
  mensajeAdmin: string = '';
  mensajePaciente: string = '';
  listadoUsuarios: any[] = [];
  showPacientesAdmins : boolean = false;
  showEspecialistas : boolean = false;
  showPacienteForm : boolean = false;
  showAdminForm  : boolean = false;
  showHistoriaClinica : boolean = false;
  showEspecialistasForm : boolean = false;
  especialidades: string[] = [];
  emailDelPaciente: string = '';
  historiaClinica: any;
  pacienteSeleccionado: any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private storage: AngularFireStorage,
    private turnosService : TurnosService
  ) {
    this.adminFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      imagen1: [null, Validators.required],
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

    this.especialistaFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      especialidad: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen1: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.usuarioService.traerEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });
  }

  setPacienteEmail(email: string): void {
    this.emailDelPaciente = email;
  }


  cargarUsuarios(): void {
    this.usuarioService.traerUsuarios().subscribe((usuarios: any[]) => {
      //this.listadoUsuarios = usuarios;
      this.listadoUsuarios = usuarios.filter(usuario => usuario.tipo === 'administrador' || usuario.tipo === 'paciente');
      this.listadoEspecialistas = usuarios.filter(usuario => usuario.tipo === 'especialista');
      this.listadoAdministradores = usuarios.filter(usuario => usuario.tipo === 'administrador');
      this.listadoPacientes = usuarios.filter(usuario => usuario.tipo === 'paciente');
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
    const imagen1 = this.adminFormGroup.get('imagen1')?.value;

    const adminData = {
      email,
      password,
      nombre,
      apellido,
      edad,
      dni,
      tipo: 'administrador',
      aprobado: true,
      imagen1: ''
    };

    const auth = getAuth();
    const adminUser = auth.currentUser;

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;
        const filePath1 = `usuarios/${uid}/${imagen1.name}`;
        const fileRef1 = this.storage.ref(filePath1);
        const uploadTask1 = this.storage.upload(filePath1, imagen1);

        uploadTask1.snapshotChanges().pipe(
          finalize(() => {
            fileRef1.getDownloadURL().subscribe((url1: string) => {
              adminData.imagen1 = url1;

              this.authService.addAdmin(adminData, imagen1, uid).then(() => {
                this.mensajeAdmin = 'Administrador registrado exitosamente.';
                this.limpiarFormulario(this.adminFormGroup);
                this.cargarUsuarios();

                if (adminUser) {
                  auth.updateCurrentUser(adminUser).then(() => {
                    console.log("Administrador logueado nuevamente.");
                  }).catch((error) => {
                    console.error("Error al loguear nuevamente al administrador:", error);
                  });
                }
              }).catch(error => {
                this.mensajeAdmin = 'Error al registrar el administrador: ' + error.message;
              });
            });
          })
        ).subscribe();
      })
      .catch(error => {
        this.mensajeAdmin = 'Error al registrar el administrador: ' + error.message;
      });
  }

  registrarPaciente(): void {
    const { email, password, nombre, apellido, edad, dni, obraSocial } = this.pacienteFormGroup.value;


    const imagen1 = this.pacienteFormGroup.get('imagen1')?.value;
    const imagen2 = this.pacienteFormGroup.get('imagen2')?.value;

    const pacienteData = {email,password,nombre,apellido,edad,dni,obraSocial,especialidad: '',tipo: 'paciente',imagen1: '',imagen2: ''};

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

  onEspecialidadChange(event: any): void {
    if (event.target.value === 'otro') {
      this.especialistaFormGroup.get('nuevaEspecialidad')?.setValidators([Validators.required, this.existingEspecialidadValidator.bind(this)]);
      this.especialistaFormGroup.get('nuevaEspecialidad')?.updateValueAndValidity();
    } else {
      this.especialistaFormGroup.get('nuevaEspecialidad')?.clearValidators();
      this.especialistaFormGroup.get('nuevaEspecialidad')?.updateValueAndValidity();
    }
  }

  existingEspecialidadValidator(control: AbstractControl): { [key: string]: any } | null {
    return this.especialidades.includes(control.value) ? { 'especialidadExistente': true } : null;
  }

  validateEspecialidad(): void {
    const nuevaEspecialidadControl = this.especialistaFormGroup.get('nuevaEspecialidad');
    if (nuevaEspecialidadControl) {
      nuevaEspecialidadControl.updateValueAndValidity();
    }
  }

  registrarEspecialista(): void {
    const { email, password, nombre, apellido, edad, dni, especialidad } = this.especialistaFormGroup.value;
    const nuevaEspecialidad = this.especialistaFormGroup.get('nuevaEspecialidad')?.value;
    const imagen1 = this.especialistaFormGroup.get('imagen1')?.value;

    let finalEspecialidad = especialidad;
    if (especialidad === 'otro') {
      finalEspecialidad = nuevaEspecialidad;
      this.usuarioService.agregarEspecialidad(finalEspecialidad);
    }

    const especialistaData = {
      email,
      password,
      nombre,
      apellido,
      edad,
      dni,
      especialidad: finalEspecialidad,
      tipo: 'especialista',
      aprobado: false,
      imagen1: ''
    };

    const auth = getAuth();
    const adminUser = auth.currentUser;

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const uid = userCredential.user.uid;
        const filePath1 = `usuarios/${uid}/${imagen1.name}`;
        const fileRef1 = this.storage.ref(filePath1);
        const uploadTask1 = this.storage.upload(filePath1, imagen1);

        uploadTask1.snapshotChanges().pipe(
          finalize(() => {
            fileRef1.getDownloadURL().subscribe((url1: string) => {
              especialistaData.imagen1 = url1;

              this.usuarioService.addEspecialista(especialistaData, imagen1, uid).then(() => {
                this.mensajeAdmin = 'Especialista registrado exitosamente.';
                this.limpiarFormulario(this.especialistaFormGroup);

                if (adminUser) {
                  auth.updateCurrentUser(adminUser).then(() => {
                    console.log("Administrador logueado nuevamente.");
                  }).catch((error) => {
                    console.error("Error al loguear nuevamente al administrador:", error);
                  });
                }
              }).catch(error => {
                this.mensajeAdmin = 'Error al registrar el especialista: ' + error.message;
              });
            });
          })
        ).subscribe();
      })
      .catch(error => {
        this.mensajeAdmin = 'Error al registrar el especialista: ' + error.message;
      });
  }

  limpiarFormulario(form: FormGroup): void {
    form.reset();
    for (let control in form.controls) {
      form.get(control)?.setErrors(null);
    }
  }



  cargarImagen1(event: any, formGroup: FormGroup): void {
    const file = event.target.files[0];
    formGroup.patchValue({ imagen1: file });
  }

  cargarImagen2(event: any): void {
    const file = event.target.files[0];
    this.pacienteFormGroup.patchValue({
      imagen2: file
    });
  }

  toggleForm(form: string): void {
    this.showAdminForm = form === 'admin';
    this.showPacienteForm = form === 'paciente';
    this.showEspecialistasForm = form === 'especialistasForm'
    this.showPacientesAdmins = form === 'pacientesAdmins';
    this.showEspecialistas = form === 'especialistas';
  }

  toggleTable(table: string): void {
    this.showPacientesAdmins = table === 'pacientesAdmins';
    this.showEspecialistas = table === 'especialistas';
  }

  descargarDatosUsuario(usuario: any): void {
    this.usuarioService.obtenerTurnosUsuario(usuario.email).subscribe(turnos => {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(turnos);
      const workbook: XLSX.WorkBook = { Sheets: { 'Turnos': worksheet }, SheetNames: ['Turnos'] };
      XLSX.writeFile(workbook, `${usuario.nombre}_${usuario.apellido}_turnos.xlsx`);
    });
  }

  descargarDatosTodosUsuario(): void {
    this.usuarioService.traerCamposEspecificosUsuarios().subscribe(user => {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(user);
      const workbook: XLSX.WorkBook = { Sheets: { 'Usuarios': worksheet }, SheetNames: ['Usuarios'] };
      XLSX.writeFile(workbook, `Usuarios.xlsx`);
    });
  }

  verHistoriaClinica(paciente: any) {
    console.log("paciente "+ paciente.email);
    this.pacienteSeleccionado = paciente;
    this.turnosService.obtenerHistoriaClinica(paciente.email).subscribe(historiaClinica => {
      this.historiaClinica = historiaClinica;
      this.showHistoriaClinica = true;
      this.abrirModal('historiaClinicaModal');
    });
  }
  abrirModal(id: string) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModal(id: string) {
    const modal = document.getElementById(id);
    this.showHistoriaClinica = false;
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
