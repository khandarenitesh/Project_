import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursmentInvoiceComponent } from './reimbursment-invoice.component';

describe('ReimbursmentInvoiceComponent', () => {
  let component: ReimbursmentInvoiceComponent;
  let fixture: ComponentFixture<ReimbursmentInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursmentInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursmentInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
