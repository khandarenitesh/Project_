import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartingAgentListComponent } from './carting-agent-list.component';

describe('CartingAgentListComponent', () => {
  let component: CartingAgentListComponent;
  let fixture: ComponentFixture<CartingAgentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartingAgentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartingAgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
