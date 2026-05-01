import { Injectable, signal, computed } from '@angular/core';
import { interval } from 'rxjs';
import { auditTime, throttleTime } from 'rxjs/operators';

export interface Stock {
  symbol: string;
  price: number;
}

export interface Order {
  symbol: string;
  quantity: number;
  buyPrice: number;
}

@Injectable({ providedIn: 'root' })
export class StockStore {
  // 100 stocks
  private stocksSignal = signal<Stock[]>(this.generateStock(100));
  stocks = this.stocksSignal.asReadonly();

  private ordersSignal = signal<Order[]>([]);
  orders = this.ordersSignal.asReadonly();

  toast = signal<string | null>(null);

  private worker!: Worker;

  // Portfolio value
  portfolioValue = computed(() => {
    return this.orders().reduce((total, order) => {
      const stock = this.stocks().find((s) => s.symbol === order.symbol);
      return total + (stock?.price || 0) * order.quantity;
    }, 0);
  });

  constructor() {
    this.loadOrdersFromStorage();

    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../../price.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        this.stocksSignal.set(data); // 🔥 update UI
      };

      this.startWorkerLoop();
    } else {
      console.error('Web Workers not supported');
    }
  }

  private loadOrdersFromStorage() {
    const saved = JSON.parse(localStorage.getItem('orders') || '[]');
    this.ordersSignal.set(saved);
  }

  private startWorkerLoop() {
    setInterval(() => {
      this.worker.postMessage(this.stocksSignal());
    }, 500);
  }

  // private startPriceFluctuation() {
  //   interval(100) // fast simulation
  //     .pipe(auditTime(500)) // 🔥 only update UI every 500ms
  //     .subscribe(() => {
  //       this.stocksSignal.update((stocks) =>
  //         stocks.map((stock) => ({
  //           ...stock,
  //           price: +(stock.price + (Math.random() - 0.5)).toFixed(2),
  //         })),
  //       );
  //     });
  // }

  // Fake stock generator
  private generateStock(count: number): Stock[] {
    return Array.from({ length: count }, (_, i) => ({
      symbol: 'STK' + i,
      price: +(Math.random() * 100).toFixed(2),
    }));
  }

  // Buy Stock
  buy(symbol: string, quantity: number) {
    const stock = this.stocksSignal().find((s) => s.symbol === symbol);
    if (!stock) return;

    const order: Order = {
      symbol,
      quantity,
      buyPrice: stock.price,
    };

    // 1. update signal (UI)
    this.ordersSignal.update((o) => [...o, order]);

    // 2. persist
    const existing = JSON.parse(localStorage.getItem('orders') || '[]');
    existing.push(order);
    localStorage.setItem('orders', JSON.stringify(existing));

    // 3. toast
    this.toast.set(`Bought ${quantity} ${symbol}`);

    setTimeout(() => this.toast.set(null), 2000);
  }
}
