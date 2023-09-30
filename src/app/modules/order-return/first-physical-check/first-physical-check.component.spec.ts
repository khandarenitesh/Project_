import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPhysicalCheckComponent } from './first-physical-check.component';

describe('FirstPhysicalCheckComponent', () => {
  let component: FirstPhysicalCheckComponent;
  let fixture: ComponentFixture<FirstPhysicalCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPhysicalCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPhysicalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
