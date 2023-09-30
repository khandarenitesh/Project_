import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisedConcernListComponent } from './raised-concern-list.component';

describe('RaisedConcernListComponent', () => {
  let component: RaisedConcernListComponent;
  let fixture: ComponentFixture<RaisedConcernListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaisedConcernListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaisedConcernListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
