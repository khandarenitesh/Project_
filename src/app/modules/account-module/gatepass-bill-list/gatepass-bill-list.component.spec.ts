import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassBillListComponent } from './gatepass-bill-list.component';

describe('GatepassBillListComponent', () => {
  let component: GatepassBillListComponent;
  let fixture: ComponentFixture<GatepassBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatepassBillListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatepassBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
