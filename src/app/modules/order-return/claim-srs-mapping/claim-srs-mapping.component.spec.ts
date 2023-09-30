import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSrsMappingComponent } from './claim-srs-mapping.component';

describe('ClaimSrsMappingComponent', () => {
  let component: ClaimSrsMappingComponent;
  let fixture: ComponentFixture<ClaimSrsMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimSrsMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSrsMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
