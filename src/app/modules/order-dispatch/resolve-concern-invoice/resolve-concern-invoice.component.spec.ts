import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveConcernInvoiceComponent } from './resolve-concern-invoice.component';

describe('ResolveConcernInvoiceComponent', () => {
  let component: ResolveConcernInvoiceComponent;
  let fixture: ComponentFixture<ResolveConcernInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolveConcernInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveConcernInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
