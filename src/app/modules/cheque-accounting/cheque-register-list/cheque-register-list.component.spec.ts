import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeRegisterListComponent } from './cheque-register-list.component';

describe('ChequeRegisterListComponent', () => {
  let component: ChequeRegisterListComponent;
  let fixture: ComponentFixture<ChequeRegisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeRegisterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
