import { TestBed } from '@angular/core/testing';

import { OrderDispatchService } from './order-dispatch.service';

describe('OrderDispatchService', () => {
  let service: OrderDispatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderDispatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
