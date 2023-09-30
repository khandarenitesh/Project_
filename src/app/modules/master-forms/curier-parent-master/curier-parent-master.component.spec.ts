import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurierParentMasterComponent } from './curier-parent-master.component';

describe('CurierParentMasterComponent', () => {
  let component: CurierParentMasterComponent;
  let fixture: ComponentFixture<CurierParentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurierParentMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurierParentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
