import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalClaimComponent } from './add-approval-claim.component';

describe('AddApprovalClaimComponent', () => {
  let component: AddApprovalClaimComponent;
  let fixture: ComponentFixture<AddApprovalClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApprovalClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApprovalClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
