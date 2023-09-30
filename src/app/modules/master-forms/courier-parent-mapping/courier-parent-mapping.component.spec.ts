import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierParentMappingComponent } from './courier-parent-mapping.component';

describe('CourierParentMappingComponent', () => {
  let component: CourierParentMappingComponent;
  let fixture: ComponentFixture<CourierParentMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierParentMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierParentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
