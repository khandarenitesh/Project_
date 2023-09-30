import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorCheckComponent } from './auditor-check.component';

describe('AuditorCheckComponent', () => {
  let component: AuditorCheckComponent;
  let fixture: ComponentFixture<AuditorCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
