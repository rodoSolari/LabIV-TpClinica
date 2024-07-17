import { Component, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-estadisticas-admin',
  templateUrl: './estadisticas-admin.component.html',
  styleUrls: ['./estadisticas-admin.component.scss']
})
export class EstadisticasAdminComponent implements OnInit{
  logs: any[] = [];
  logsPaginados: any[] = [];
  tamanoPagina: number = 10;
  paginaActual: number = 0;

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.cargarLogs();
  }

  async cargarLogs(): Promise<void> {
    this.logs = await this.logService.obtenerTodosLosLogs();
    this.actualizarLogsPaginados();
  }

  actualizarLogsPaginados(): void {
    const inicio = this.paginaActual * this.tamanoPagina;
    const fin = inicio + this.tamanoPagina;
    this.logsPaginados = this.logs.slice(inicio, fin);
  }

  siguiente(): void {
    if ((this.paginaActual + 1) * this.tamanoPagina < this.logs.length) {
      this.paginaActual++;
      this.actualizarLogsPaginados();
    }
  }

  anterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarLogsPaginados();
    }
  }
}
