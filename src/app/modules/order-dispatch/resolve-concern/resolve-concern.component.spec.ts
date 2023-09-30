import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveConcernComponent } from './resolve-concern.component';

describe('ResolveConcernComponent', () => {
  let component: ResolveConcernComponent;
  let fixture: ComponentFixture<ResolveConcernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolveConcernComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
