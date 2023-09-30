import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsuranceClaimComponent } from './add-insurance-claim.component';

describe('AddInsuranceClaimComponent', () => {
  let component: AddInsuranceClaimComponent;
  let fixture: ComponentFixture<AddInsuranceClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInsuranceClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsuranceClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
