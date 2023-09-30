import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStockistOutstandingComponent } from './import-stockist-outstanding.component';

describe('ImportStockistOutstandingComponent', () => {
  let component: ImportStockistOutstandingComponent;
  let fixture: ComponentFixture<ImportStockistOutstandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportStockistOutstandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportStockistOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
