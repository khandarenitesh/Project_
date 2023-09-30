import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCompanyRelationComponent } from './branch-company-relation.component';

describe('BranchCompanyRelationComponent', () => {
  let component: BranchCompanyRelationComponent;
  let fixture: ComponentFixture<BranchCompanyRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchCompanyRelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCompanyRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
