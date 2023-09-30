import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToDispatchComponent } from './ready-to-dispatch.component';

describe('ReadyToDispatchComponent', () => {
  let component: ReadyToDispatchComponent;
  let fixture: ComponentFixture<ReadyToDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyToDispatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyToDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
