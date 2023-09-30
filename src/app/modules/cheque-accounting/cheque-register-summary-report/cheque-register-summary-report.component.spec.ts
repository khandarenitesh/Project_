import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeRegisterSummaryReportComponent } from './cheque-register-summary-report.component';

describe('ChequeRegisterSummaryReportComponent', () => {
  let component: ChequeRegisterSummaryReportComponent;
  let fixture: ComponentFixture<ChequeRegisterSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeRegisterSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeRegisterSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
