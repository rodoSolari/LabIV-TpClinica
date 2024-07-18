import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosFinalizadosPorMedicoComponent } from './grafico-turnos-finalizados-por-medico.component';

describe('GraficoTurnosFinalizadosPorMedicoComponent', () => {
  let component: GraficoTurnosFinalizadosPorMedicoComponent;
  let fixture: ComponentFixture<GraficoTurnosFinalizadosPorMedicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoTurnosFinalizadosPorMedicoComponent]
    });
    fixture = TestBed.createComponent(GraficoTurnosFinalizadosPorMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
