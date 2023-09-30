import { TestBed } from '@angular/core/testing';

import { SuperAdminauthGuard } from './superadminauth.guard';

describe('SuperAdminauthGuard', () => {
  let guard: SuperAdminauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SuperAdminauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
