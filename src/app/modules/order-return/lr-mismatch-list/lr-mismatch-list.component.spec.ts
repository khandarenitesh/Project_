import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LrMismatchListComponent } from './lr-mismatch-list.component';

describe('LrMismatchListComponent', () => {
  let component: LrMismatchListComponent;
  let fixture: ComponentFixture<LrMismatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LrMismatchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LrMismatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
