import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestructionCertificateListComponent } from './destruction-certificate-list.component';

describe('DestructionCertificateListComponent', () => {
  let component: DestructionCertificateListComponent;
  let fixture: ComponentFixture<DestructionCertificateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DestructionCertificateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestructionCertificateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
