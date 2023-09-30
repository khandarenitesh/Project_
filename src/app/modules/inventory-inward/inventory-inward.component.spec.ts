import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryInwardComponent } from './inventory-inward.component';

describe('InventoryInwardComponent', () => {
  let component: InventoryInwardComponent;
  let fixture: ComponentFixture<InventoryInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryInwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
