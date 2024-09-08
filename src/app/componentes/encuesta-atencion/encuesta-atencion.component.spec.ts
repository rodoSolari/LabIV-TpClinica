import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaAtencionComponent } from './encuesta-atencion.component';

describe('EncuestaAtencionComponent', () => {
  let component: EncuestaAtencionComponent;
  let fixture: ComponentFixture<EncuestaAtencionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncuestaAtencionComponent]
    });
    fixture = TestBed.createComponent(EncuestaAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
