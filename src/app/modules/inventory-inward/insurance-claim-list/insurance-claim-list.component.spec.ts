import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceClaimListComponent } from './insurance-claim-list.component';

describe('InsuranceClaimListComponent', () => {
  let component: InsuranceClaimListComponent;
  let fixture: ComponentFixture<InsuranceClaimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceClaimListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
