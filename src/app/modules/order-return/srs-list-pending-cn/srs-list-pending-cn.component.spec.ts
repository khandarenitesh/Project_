import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrsListPendingCnComponent } from './srs-list-pending-cn.component';

describe('SrsListPendingCnComponent', () => {
  let component: SrsListPendingCnComponent;
  let fixture: ComponentFixture<SrsListPendingCnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrsListPendingCnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrsListPendingCnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
