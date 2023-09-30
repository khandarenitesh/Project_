import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleChecklistImgComponent } from './vehicle-checklist-img.component';

describe('VehicleChecklistImgComponent', () => {
  let component: VehicleChecklistImgComponent;
  let fixture: ComponentFixture<VehicleChecklistImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleChecklistImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleChecklistImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
