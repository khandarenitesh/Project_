import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingClaimFormListComponent } from './missing-claim-form-list.component';

describe('MissingClaimFormListComponent', () => {
  let component: MissingClaimFormListComponent;
  let fixture: ComponentFixture<MissingClaimFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingClaimFormListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingClaimFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
