import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRow } from './order-row';

describe('OrderRow', () => {
  let component: OrderRow;
  let fixture: ComponentFixture<OrderRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderRow],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
