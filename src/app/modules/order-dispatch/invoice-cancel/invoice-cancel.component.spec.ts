import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCancelComponent } from './invoice-cancel.component';

describe('InvoiceCancelComponent', () => {
  let component: InvoiceCancelComponent;
  let fixture: ComponentFixture<InvoiceCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
