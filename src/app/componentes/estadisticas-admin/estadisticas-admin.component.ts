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
  ultimoVisible: QueryDocumentSnapshot | null = null;
  tamanoPagina: number = 10;
  hayMas: boolean = false;
  historial: QueryDocumentSnapshot[] = [];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.cargarLogs();

  }

  async cargarLogs(): Promise<void> {
    const logs = await this.logService.obtenerLogsOrdenados(this.ultimoVisible, this.tamanoPagina);
    if (logs.length < this.tamanoPagina) {
      this.hayMas = false;
    }
    //this.logs = logs.map(doc => doc.data());
    this.logs = logs.map(doc => {
      const data = doc.data();
      data.fechaHora = new Date(data.fechaHora);
      return data;
    });
    if (this.ultimoVisible) {
      this.historial.push(this.ultimoVisible);
    }
    this.ultimoVisible = logs.length > 0 ? logs[logs.length - 1] : null;
  }

  async siguiente(): Promise<void> {
    if (this.hayMas) {
      await this.cargarLogs();
    }
  }

  async anterior(): Promise<void> {
    if (this.historial.length > 1) {
      this.historial.pop(); // Eliminar la última entrada
      this.ultimoVisible = this.historial.length > 0 ? this.historial.pop()! : null; // Obtener la entrada anterior
      await this.cargarLogs();
    }
  }
}
