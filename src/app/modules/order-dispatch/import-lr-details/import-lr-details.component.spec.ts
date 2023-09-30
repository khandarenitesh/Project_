import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLRDetailsComponent } from './import-lr-details.component';

describe('ImportLRDetailsComponent', () => {
  let component: ImportLRDetailsComponent;
  let fixture: ComponentFixture<ImportLRDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportLRDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLRDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
