import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDestructCertificateComponent } from './upload-destruct-certificate.component';

describe('UploadDestructCertificateComponent', () => {
  let component: UploadDestructCertificateComponent;
  let fixture: ComponentFixture<UploadDestructCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDestructCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDestructCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
