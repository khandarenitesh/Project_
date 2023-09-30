import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInvoiceListComponent } from './check-invoice-list.component';

describe('CheckInvoiceListComponent', () => {
  let component: CheckInvoiceListComponent;
  let fixture: ComponentFixture<CheckInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInvoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
