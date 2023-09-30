import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDepositedChequeComponent } from './import-deposited-cheque.component';

describe('ImportDepositedChequeComponent', () => {
  let component: ImportDepositedChequeComponent;
  let fixture: ComponentFixture<ImportDepositedChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDepositedChequeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDepositedChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
