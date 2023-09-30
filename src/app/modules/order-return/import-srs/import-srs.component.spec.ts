import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSrsComponent } from './import-srs.component';

describe('ImportSrsComponent', () => {
  let component: ImportSrsComponent;
  let fixture: ComponentFixture<ImportSrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
