import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceRegisterAddComponent } from './expence-register-add.component';

describe('ExpenceRegisterAddComponent', () => {
  let component: ExpenceRegisterAddComponent;
  let fixture: ComponentFixture<ExpenceRegisterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenceRegisterAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceRegisterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
