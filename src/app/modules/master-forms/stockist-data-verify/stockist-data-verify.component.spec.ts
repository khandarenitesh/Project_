import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistDataVerifyComponent } from './stockist-data-verify.component';

describe('StockistDataVerifyComponent', () => {
  let component: StockistDataVerifyComponent;
  let fixture: ComponentFixture<StockistDataVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockistDataVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockistDataVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
