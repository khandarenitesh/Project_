import { TestBed } from '@angular/core/testing';

import { SupervisorauthGuard } from './supervisorauth.guard';

describe('SupervisorauthGuard', () => {
  let guard: SupervisorauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SupervisorauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
