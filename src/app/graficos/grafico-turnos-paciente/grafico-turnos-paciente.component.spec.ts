import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosPacienteComponent } from './grafico-turnos-paciente.component';

describe('GraficoTurnosPacienteComponent', () => {
  let component: GraficoTurnosPacienteComponent;
  let fixture: ComponentFixture<GraficoTurnosPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoTurnosPacienteComponent]
    });
    fixture = TestBed.createComponent(GraficoTurnosPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
