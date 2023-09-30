import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistAddComponent } from './stockist-add.component';

describe('StockistAddComponent', () => {
  let component: StockistAddComponent;
  let fixture: ComponentFixture<StockistAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockistAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockistAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
