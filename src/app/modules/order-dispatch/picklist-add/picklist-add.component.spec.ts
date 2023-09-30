import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistAddComponent } from './picklist-add.component';

describe('PicklistAddComponent', () => {
  let component: PicklistAddComponent;
  let fixture: ComponentFixture<PicklistAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicklistAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
