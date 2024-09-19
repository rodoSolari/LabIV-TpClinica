import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoEncuestaComponent } from './grafico-encuesta.component';

describe('GraficoEncuestaComponent', () => {
  let component: GraficoEncuestaComponent;
  let fixture: ComponentFixture<GraficoEncuestaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoEncuestaComponent]
    });
    fixture = TestBed.createComponent(GraficoEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
