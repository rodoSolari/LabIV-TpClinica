import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoVisitasLogsComponent } from './grafico-visitas-logs.component';

describe('GraficoVisitasLogsComponent', () => {
  let component: GraficoVisitasLogsComponent;
  let fixture: ComponentFixture<GraficoVisitasLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoVisitasLogsComponent]
    });
    fixture = TestBed.createComponent(GraficoVisitasLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
