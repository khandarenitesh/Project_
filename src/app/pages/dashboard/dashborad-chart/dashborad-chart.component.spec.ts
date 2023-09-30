import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradChartComponent } from './dashborad-chart.component';

describe('DashboradChartComponent', () => {
  let component: DashboradChartComponent;
  let fixture: ComponentFixture<DashboradChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboradChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboradChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
