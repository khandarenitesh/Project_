import { TestBed } from '@angular/core/testing';

import { OrderReturnService } from './order-return.service';

describe('OrderReturnService', () => {
  let service: OrderReturnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderReturnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
