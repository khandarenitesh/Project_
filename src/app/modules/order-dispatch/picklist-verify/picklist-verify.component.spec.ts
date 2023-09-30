import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistVerifyComponent } from './picklist-verify.component';

describe('PicklistVerifyComponent', () => {
  let component: PicklistVerifyComponent;
  let fixture: ComponentFixture<PicklistVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PicklistVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PicklistVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
