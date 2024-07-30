import { Component, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { LogService } from 'src/app/services/log.service';
import * as XLSX from 'xlsx';

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

  exportarLogsAExcel(): void {
    const dataToExport = this.logs.map(log => ({
      Email: log.email,
      FechaHora: log.fechaHora
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Logs': worksheet }, SheetNames: ['Logs'] };
    XLSX.writeFile(workbook, 'Logs.xlsx');
  }
}
