import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoMedicosEspecialidadComponent } from './grafico-medicos-especialidad.component';

describe('GraficoMedicosEspecialidadComponent', () => {
  let component: GraficoMedicosEspecialidadComponent;
  let fixture: ComponentFixture<GraficoMedicosEspecialidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoMedicosEspecialidadComponent]
    });
    fixture = TestBed.createComponent(GraficoMedicosEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
