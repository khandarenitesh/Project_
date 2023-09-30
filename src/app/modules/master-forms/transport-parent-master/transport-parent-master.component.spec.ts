import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportParentMasterComponent } from './transport-parent-master.component';

describe('TransportParentMasterComponent', () => {
  let component: TransportParentMasterComponent;
  let fixture: ComponentFixture<TransportParentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportParentMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportParentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
