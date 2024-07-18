import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoEspecialidadesComponent } from './grafico-especialidades.component';

describe('GraficoEspecialidadesComponent', () => {
  let component: GraficoEspecialidadesComponent;
  let fixture: ComponentFixture<GraficoEspecialidadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoEspecialidadesComponent]
    });
    fixture = TestBed.createComponent(GraficoEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
