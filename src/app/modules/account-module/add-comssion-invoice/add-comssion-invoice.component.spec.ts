import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComssionInvoiceComponent } from './add-comssion-invoice.component';

describe('AddComssionInvoiceComponent', () => {
  let component: AddComssionInvoiceComponent;
  let fixture: ComponentFixture<AddComssionInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddComssionInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComssionInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
