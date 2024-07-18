import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoDiasComponent } from './grafico-dias.component';

describe('GraficoDiasComponent', () => {
  let component: GraficoDiasComponent;
  let fixture: ComponentFixture<GraficoDiasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoDiasComponent]
    });
    fixture = TestBed.createComponent(GraficoDiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
