import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurierAddComponent } from './curier-add.component';

describe('CurierAddComponent', () => {
  let component: CurierAddComponent;
  let fixture: ComponentFixture<CurierAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurierAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
