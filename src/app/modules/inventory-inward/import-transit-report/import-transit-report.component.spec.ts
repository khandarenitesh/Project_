import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTransitReportComponent } from './import-transit-report.component';

describe('ImportTransitReportComponent', () => {
  let component: ImportTransitReportComponent;
  let fixture: ComponentFixture<ImportTransitReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTransitReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTransitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
