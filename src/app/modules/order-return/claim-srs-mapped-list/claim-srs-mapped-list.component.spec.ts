import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSrsMappedListComponent } from './claim-srs-mapped-list.component';

describe('ClaimSrsMappedListComponent', () => {
  let component: ClaimSrsMappedListComponent;
  let fixture: ComponentFixture<ClaimSrsMappedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimSrsMappedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSrsMappedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
