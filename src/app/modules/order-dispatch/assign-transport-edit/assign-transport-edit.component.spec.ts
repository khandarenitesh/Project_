import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTransportEditComponent } from './assign-transport-edit.component';

describe('AssignTransportEditComponent', () => {
  let component: AssignTransportEditComponent;
  let fixture: ComponentFixture<AssignTransportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTransportEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTransportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
