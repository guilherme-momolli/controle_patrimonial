import { TestBed } from '@angular/core/testing';

import { Veiculo, VeiculoService } from './veiculo.service';

describe('VeiculoService', () => {
  let service: VeiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
