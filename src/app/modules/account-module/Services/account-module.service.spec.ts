import { TestBed } from '@angular/core/testing';

import { AccountModuleService } from './account-module.service';

describe('AccountModuleService', () => {
  let service: AccountModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
