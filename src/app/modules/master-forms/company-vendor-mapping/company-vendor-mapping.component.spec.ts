import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyVendorMappingComponent } from './company-vendor-mapping.component';

describe('CompanyVendorMappingComponent', () => {
  let component: CompanyVendorMappingComponent;
  let fixture: ComponentFixture<CompanyVendorMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyVendorMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyVendorMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
