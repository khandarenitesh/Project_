import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterFormsComponent } from './master-forms.component';

describe('MasterFormsComponent', () => {
  let component: MasterFormsComponent;
  let fixture: ComponentFixture<MasterFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
