import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDynamicallyComponent } from './import-dynamically.component';

describe('ImportDynamicallyComponent', () => {
  let component: ImportDynamicallyComponent;
  let fixture: ComponentFixture<ImportDynamicallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDynamicallyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDynamicallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
