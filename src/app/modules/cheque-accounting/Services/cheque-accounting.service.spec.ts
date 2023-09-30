import { TestBed } from '@angular/core/testing';

import { ChequeAccountingService } from './cheque-accounting.service';

describe('ChequeAccountingService', () => {
  let service: ChequeAccountingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChequeAccountingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
