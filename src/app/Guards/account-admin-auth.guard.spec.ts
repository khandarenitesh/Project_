import { TestBed } from '@angular/core/testing';

import { AccountAdminAuthGuard } from './account-admin-auth.guard';

describe('AccountAdminAuthGuard', () => {
  let guard: AccountAdminAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccountAdminAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
