import { TestBed } from '@angular/core/testing';

import { MastersServiceService } from './masters-service.service';

describe('MastersServiceService', () => {
  let service: MastersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MastersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
