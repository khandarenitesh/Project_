import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommsionInvoiceListComponent } from './commsion-invoice-list.component';

describe('CommsionInvoiceListComponent', () => {
  let component: CommsionInvoiceListComponent;
  let fixture: ComponentFixture<CommsionInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommsionInvoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommsionInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
