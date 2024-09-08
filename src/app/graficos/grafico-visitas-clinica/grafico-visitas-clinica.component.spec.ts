import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoVisitasClinicaComponent } from './grafico-visitas-clinica.component';

describe('GraficoVisitasClinicaComponent', () => {
  let component: GraficoVisitasClinicaComponent;
  let fixture: ComponentFixture<GraficoVisitasClinicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoVisitasClinicaComponent]
    });
    fixture = TestBed.createComponent(GraficoVisitasClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
