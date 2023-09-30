import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveClaimConcernComponent } from './resolve-claim-concern.component';

describe('ResolveClaimConcernComponent', () => {
  let component: ResolveClaimConcernComponent;
  let fixture: ComponentFixture<ResolveClaimConcernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolveClaimConcernComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveClaimConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
