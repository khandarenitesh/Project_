import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistBranchRelationComponent } from './stockist-branch-relation.component';

describe('StockistBranchRelationComponent', () => {
  let component: StockistBranchRelationComponent;
  let fixture: ComponentFixture<StockistBranchRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockistBranchRelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockistBranchRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
