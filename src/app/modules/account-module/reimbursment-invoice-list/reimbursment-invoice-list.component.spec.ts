import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursmentInvoiceListComponent } from './reimbursment-invoice-list.component';

describe('ReimbursmentInvoiceListComponent', () => {
  let component: ReimbursmentInvoiceListComponent;
  let fixture: ComponentFixture<ReimbursmentInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursmentInvoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursmentInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
