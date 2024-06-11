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
  currentUserUid: string | null = null;
  mensajeAdmin: string = '';
  mensajePaciente: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth,
    private firestore: Firestore
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
      imagen1: ['', Validators.required],
      imagen2: ['', Validators.required]
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
    this.authService.register(adminData.email, adminData.password).then(userCredential => {
      this.authService.addAdmin(adminData).then(() => {
        this.mensajeAdmin = 'Administrador registrado exitosamente.';
        this.limpiarFormulario(this.adminFormGroup);
        this.cargarUsuarios();
      }).catch(error => {
        this.mensajeAdmin = error.message;
      });
    }).catch(error => {
      this.mensajeAdmin = error.message;
    });
  }

  registrarPaciente(): void {
    if (!this.currentUserUid) {
      console.error('No user is currently logged in.');
      return;
    }

    const { email, password, nombre, apellido, edad, dni, obraSocial } = this.pacienteFormGroup.value;
    const pacienteData = {
      email,
      password,
      nombre,
      apellido,
      edad,
      dni,
      obraSocial,
      tipo: 'paciente'
    };

    const imagen1 = this.pacienteFormGroup.get('imagen1')?.value;
    const imagen2 = this.pacienteFormGroup.get('imagen2')?.value;

    this.authService.register(pacienteData.email, pacienteData.password).then(userCredential => {
      this.usuarioService.addPaciente(pacienteData, imagen1, imagen2, this.currentUserUid!).then(() => {
        this.mensajePaciente = 'Paciente registrado exitosamente.';
        this.limpiarFormulario(this.pacienteFormGroup);
        this.cargarUsuarios();
      }).catch(error => {
        this.mensajePaciente = error.message;
      });
    }).catch(error => {
      this.mensajePaciente = error.message;
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
