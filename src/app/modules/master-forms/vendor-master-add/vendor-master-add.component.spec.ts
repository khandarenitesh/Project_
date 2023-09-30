import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMasterAddComponent } from './vendor-master-add.component';

describe('VendorMasterAddComponent', () => {
  let component: VendorMasterAddComponent;
  let fixture: ComponentFixture<VendorMasterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorMasterAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorMasterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
