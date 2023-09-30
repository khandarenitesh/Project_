import { TestBed } from '@angular/core/testing';

import { AccountantauthGuard } from './accountantauth.guard';

describe('AccountantauthGuard', () => {
  let guard: AccountantauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccountantauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
