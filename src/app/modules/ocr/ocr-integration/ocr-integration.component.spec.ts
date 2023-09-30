import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrIntegrationComponent } from './ocr-integration.component';

describe('OcrIntegrationComponent', () => {
  let component: OcrIntegrationComponent;
  let fixture: ComponentFixture<OcrIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcrIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
