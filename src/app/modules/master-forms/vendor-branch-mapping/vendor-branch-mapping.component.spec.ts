import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBranchMappingComponent } from './vendor-branch-mapping.component';

describe('VendorBranchMappingComponent', () => {
  let component: VendorBranchMappingComponent;
  let fixture: ComponentFixture<VendorBranchMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorBranchMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorBranchMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
