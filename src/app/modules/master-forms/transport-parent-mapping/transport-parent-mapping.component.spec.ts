import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportParentMappingComponent } from './transport-parent-mapping.component';

describe('TransportParentMappingComponent', () => {
  let component: TransportParentMappingComponent;
  let fixture: ComponentFixture<TransportParentMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportParentMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportParentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
