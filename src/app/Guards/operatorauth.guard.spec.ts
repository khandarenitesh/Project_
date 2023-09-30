import { TestBed } from '@angular/core/testing';

import { OperatorauthGuard } from './operatorauth.guard';

describe('OperatorauthGuard', () => {
  let guard: OperatorauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OperatorauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
