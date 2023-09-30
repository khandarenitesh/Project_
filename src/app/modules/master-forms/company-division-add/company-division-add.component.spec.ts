import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDivisionAddComponent } from './company-division-add.component';

describe('CompanyDivisionAddComponent', () => {
  let component: CompanyDivisionAddComponent;
  let fixture: ComponentFixture<CompanyDivisionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDivisionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDivisionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
