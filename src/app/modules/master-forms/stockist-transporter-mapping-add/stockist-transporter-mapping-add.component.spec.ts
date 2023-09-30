import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistTransporterMappingAddComponent } from './stockist-transporter-mapping-add.component';

describe('StockistTransporterMappingAddComponent', () => {
  let component: StockistTransporterMappingAddComponent;
  let fixture: ComponentFixture<StockistTransporterMappingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockistTransporterMappingAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockistTransporterMappingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
