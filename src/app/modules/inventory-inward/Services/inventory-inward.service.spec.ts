import { TestBed } from '@angular/core/testing';

import { InventoryInwardService } from './inventory-inward.service';

describe('InventoryInwardService', () => {
  let service: InventoryInwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryInwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
