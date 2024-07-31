import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosAdministradorComponent } from './turnos-administrador.component';

describe('TurnosAdministradorComponent', () => {
  let component: TurnosAdministradorComponent;
  let fixture: ComponentFixture<TurnosAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnosAdministradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
