import { TestBed } from '@angular/core/testing';

import { IsadminonlyGuard } from './isadminonly.guard';

describe('IsadminonlyGuard', () => {
  let guard: IsadminonlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsadminonlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
