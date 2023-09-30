import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCreditNoteComponent } from './import-credit-note.component';

describe('ImportCreditNoteComponent', () => {
  let component: ImportCreditNoteComponent;
  let fixture: ComponentFixture<ImportCreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCreditNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
