import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeSummaryReportComponent } from './cheque-summary-report.component';

describe('ChequeSummaryReportComponent', () => {
  let component: ChequeSummaryReportComponent;
  let fixture: ComponentFixture<ChequeSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
