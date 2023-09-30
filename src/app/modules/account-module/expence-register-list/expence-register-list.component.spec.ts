import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenceRegisterListComponent } from './expence-register-list.component';

describe('ExpenceRegisterListComponent', () => {
  let component: ExpenceRegisterListComponent;
  let fixture: ComponentFixture<ExpenceRegisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenceRegisterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
