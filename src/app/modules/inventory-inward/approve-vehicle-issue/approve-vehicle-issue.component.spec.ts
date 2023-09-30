import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveVehicleIssueComponent } from './approve-vehicle-issue.component';

describe('ApproveVehicleIssueComponent', () => {
  let component: ApproveVehicleIssueComponent;
  let fixture: ComponentFixture<ApproveVehicleIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveVehicleIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveVehicleIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
