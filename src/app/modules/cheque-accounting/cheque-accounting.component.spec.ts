import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeAccountingComponent } from './cheque-accounting.component';

describe('ChequeAccountingComponent', () => {
  let component: ChequeAccountingComponent;
  let fixture: ComponentFixture<ChequeAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
