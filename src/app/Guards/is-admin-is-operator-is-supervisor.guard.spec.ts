import { TestBed } from '@angular/core/testing';

import { IsAdminIsOperatorIsSupervisorGuard } from './is-admin-is-operator-is-supervisor.guard';

describe('IsAdminIsOperatorIsSupervisorGuard', () => {
  let guard: IsAdminIsOperatorIsSupervisorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAdminIsOperatorIsSupervisorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
