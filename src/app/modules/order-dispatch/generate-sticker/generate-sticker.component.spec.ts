import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateStickerComponent } from './generate-sticker.component';

describe('GenerateStickerComponent', () => {
  let component: GenerateStickerComponent;
  let fixture: ComponentFixture<GenerateStickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateStickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateStickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
