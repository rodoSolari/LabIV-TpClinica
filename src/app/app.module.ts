import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { HomeComponent } from './componentes/home/home.component';
import { BotonesDirective } from './directivas/botones.directive';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { SolicitarTurnoComponent } from './componentes/solicitar-turno/solicitar-turno.component';
import { MisTurnosPacienteComponent } from './componentes/mis-turnos-paciente/mis-turnos-paciente.component';
import { MisTurnosEspecialistaComponent } from './componentes/mis-turnos-especialista/mis-turnos-especialista.component';
import { TurnosAdministradorComponent } from './componentes/turnos-administrador/turnos-administrador.component';
import { MiPerfilComponent } from './componentes/mi-perfil/mi-perfil.component';
import { HistoriaClinicaComponent } from './componentes/historia-clinica/historia-clinica.component';
import { PacientesComponent } from './componentes/pacientes/pacientes.component';
import { EstadisticasAdminComponent } from './componentes/estadisticas-admin/estadisticas-admin.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ChartistModule } from 'ng-chartist';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { GraficosModule } from './graficos/graficos.module';
import { PrimeraLetraMayusculaPipe } from './Pipes/primera-letra-mayuscula.pipe';
import { FormatTimePipe } from './Pipes/format-time.pipe';

import { FormatDniPipe } from './Pipes/format-dni.pipe';
import { StyleLinksDirective } from './directivas/style-links.directive';

const firebaseConfig = AngularFireModule.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    NavbarComponent,
    HomeComponent,
    //BotonesDirective,
    UsuariosComponent,
    SolicitarTurnoComponent,
    MisTurnosPacienteComponent,
    MisTurnosEspecialistaComponent,
    TurnosAdministradorComponent,
    MiPerfilComponent,
    HistoriaClinicaComponent,
    PacientesComponent,
    EstadisticasAdminComponent,
    PrimeraLetraMayusculaPipe,
    FormatTimePipe,
    FormatDniPipe,
    StyleLinksDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartistModule,
    NgxCaptchaModule,
    firebaseConfig,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    GraficosModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
