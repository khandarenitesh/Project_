import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistTransporterMappingListComponent } from './stockist-transporter-mapping-list.component';

describe('StockistTransporterMappingListComponent', () => {
  let component: StockistTransporterMappingListComponent;
  let fixture: ComponentFixture<StockistTransporterMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockistTransporterMappingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockistTransporterMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
