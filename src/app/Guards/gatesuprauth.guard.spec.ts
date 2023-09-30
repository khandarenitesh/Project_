import { TestBed } from '@angular/core/testing';

import { GatesuprauthGuard } from './gatesuprauth.guard';

describe('GatesuprauthGuard', () => {
  let guard: GatesuprauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GatesuprauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
