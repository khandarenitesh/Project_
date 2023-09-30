import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityInvoiceListComponent } from './priority-invoice-list.component';

describe('PriorityInvoiceListComponent', () => {
  let component: PriorityInvoiceListComponent;
  let fixture: ComponentFixture<PriorityInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityInvoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
