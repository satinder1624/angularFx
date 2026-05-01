import { Component, computed, inject, signal } from '@angular/core';
import { StockStore } from '../../core/services/stock.store';
import { OrderRow } from '../../shared/components/order-row/order-row';
import { DecimalPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  imports: [OrderRow, NgForOf, DecimalPipe],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {
  store = inject(StockStore);
  orders = signal<any[]>(this.loadOrders());

  // 🔥 Enriched orders with live data
  enrichedOrders = computed(() => {
    const stocks = this.store.stocks();

    return this.orders().map((order) => {
      const stock = stocks.find((s) => s.symbol === order.symbol);

      const quantity = order.quantity ?? order.qty ?? 0;
      const buyPrice = order.buyPrice ?? 0;
      const currentPrice = stock?.price ?? buyPrice;

      const currentValue = currentPrice * quantity;
      const invested = buyPrice * quantity;
      const profit = currentValue - invested;

      return {
        ...order,
        quantity,
        buyPrice,
        currentPrice,
        currentValue,
        invested,
        profit,
      };
    });
  });
  totalPortfolio = computed(() => {
    return this.enrichedOrders().reduce((sum, order) => {
      return sum + (order.currentValue || 0);
    }, 0);
  });

  trackBySymbol(index: number, item: any) {
    return item.symbol;
  }

  private loadOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]').map((o: any) => ({
      symbol: o.symbol,
      quantity: o.quantity,
      buyPrice: o.buyPrice,
    }));
  }
}
