import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCnfAddComponent } from './other-cnf-add.component';

describe('OtherCnfAddComponent', () => {
  let component: OtherCnfAddComponent;
  let fixture: ComponentFixture<OtherCnfAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherCnfAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherCnfAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
