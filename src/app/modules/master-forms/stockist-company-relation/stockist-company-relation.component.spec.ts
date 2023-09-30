import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistCompanyRelationComponent } from './stockist-company-relation.component';

describe('StockistCompanyRelationComponent', () => {
  let component: StockistCompanyRelationComponent;
  let fixture: ComponentFixture<StockistCompanyRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockistCompanyRelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockistCompanyRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
