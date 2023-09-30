import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAllotPickerComponent } from './re-allot-picker.component';

describe('ReAllotPickerComponent', () => {
  let component: ReAllotPickerComponent;
  let fixture: ComponentFixture<ReAllotPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReAllotPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAllotPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
