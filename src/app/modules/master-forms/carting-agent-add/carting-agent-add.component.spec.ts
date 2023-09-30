import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartingAgentAddComponent } from './carting-agent-add.component';

describe('CartingAgentAddComponent', () => {
  let component: CartingAgentAddComponent;
  let fixture: ComponentFixture<CartingAgentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartingAgentAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartingAgentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
