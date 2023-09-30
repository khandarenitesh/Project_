import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTransportModeComponent } from './assign-transport-mode.component';

describe('AssignTransportModeComponent', () => {
  let component: AssignTransportModeComponent;
  let fixture: ComponentFixture<AssignTransportModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTransportModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTransportModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
