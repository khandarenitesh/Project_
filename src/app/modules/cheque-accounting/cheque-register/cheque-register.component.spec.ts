import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeRegisterComponent } from './cheque-register.component';

describe('ChequeRegisterComponent', () => {
  let component: ChequeRegisterComponent;
  let fixture: ComponentFixture<ChequeRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
