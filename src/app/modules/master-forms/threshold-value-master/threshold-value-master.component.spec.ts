import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdValueMasterComponent } from './threshold-value-master.component';

describe('ThresholdValueMasterComponent', () => {
  let component: ThresholdValueMasterComponent;
  let fixture: ComponentFixture<ThresholdValueMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThresholdValueMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdValueMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
