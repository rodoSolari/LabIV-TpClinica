import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPacientesPorEspecialidadComponent } from './grafico-pacientes-por-especialidad.component';

describe('GraficoPacientesPorEspecialidadComponent', () => {
  let component: GraficoPacientesPorEspecialidadComponent;
  let fixture: ComponentFixture<GraficoPacientesPorEspecialidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoPacientesPorEspecialidadComponent]
    });
    fixture = TestBed.createComponent(GraficoPacientesPorEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
