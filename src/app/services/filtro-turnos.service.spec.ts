import { TestBed } from '@angular/core/testing';

import { FiltroTurnosService } from './filtro-turnos.service';

describe('FiltroTurnosService', () => {
  let service: FiltroTurnosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltroTurnosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
