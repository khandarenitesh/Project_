import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeRegisterSummaryReportDialogComponent } from './cheque-register-summary-report-dialog.component';

describe('ChequeRegisterSummaryReportDialogComponent', () => {
  let component: ChequeRegisterSummaryReportDialogComponent;
  let fixture: ComponentFixture<ChequeRegisterSummaryReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeRegisterSummaryReportDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeRegisterSummaryReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
