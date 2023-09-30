import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistOutstandingDetailsComponent } from './stockist-outstanding-details.component';

describe('StockistOutstandingDetailsComponent', () => {
  let component: StockistOutstandingDetailsComponent;
  let fixture: ComponentFixture<StockistOutstandingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockistOutstandingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockistOutstandingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
