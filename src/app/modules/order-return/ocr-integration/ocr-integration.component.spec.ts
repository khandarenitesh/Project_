import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OCRIntegrationComponent } from './ocr-integration.component';

describe('OCRIntegrationComponent', () => {
  let component: OCRIntegrationComponent;
  let fixture: ComponentFixture<OCRIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OCRIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OCRIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
