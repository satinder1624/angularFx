import {
  Component,
  inject,
  signal,
  effect,
  computed,
  AfterViewInit,
} from '@angular/core';
import { StockStore } from '../../core/services/stock.store';
import { DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stock-detail',
  imports: [NgIf, NgForOf, DecimalPipe, NgClass, DatePipe],
  templateUrl: './stock-detail.html',
  styleUrl: './stock-detail.css',
})
export class StockDetail implements AfterViewInit {
  store = inject(StockStore);
  route = inject(ActivatedRoute);

  toast = this.store.toast

  selectedSymbol = signal<string | null>(null);

  chart!: Chart;

  constructor() {
    this.route.params.subscribe((params) => {
      this.selectedSymbol.set(params['symbol']);
    });
  }

  selectedStock = computed(() => {
    return this.store.stocks().find((s) => s.symbol === this.selectedSymbol());
  });
  previousPrice = new Map<string, number>();
  priceHistory = signal<{ time: number; price: number }[]>([]);
  timeframe = signal<'1m' | '2m' | '5m'>('1m');

  private priceEffect = effect((): void => {
    const stock = this.selectedStock();
    if (!stock) return;

    this.priceHistory.update((arr) => [
      ...arr.slice(-200), // keep more history
      {
        time: Date.now(),
        price: stock.price,
      },
    ]);

    if (this.chart) {
      const data = this.getFilteredData();

      this.chart.data.labels = data.map((d) => '');
      this.chart.data.datasets[0].data = data.map((d) => d.price);

      this.chart.update();
    }
  });

  buy(x: string, y: number) {
    this.store.buy(x, y);
  }

  ngAfterViewInit() {
    this.chart = new Chart('chartCanvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Price',
            data: [],
            borderColor: '#00e676',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true, // 🔥 MUST
        maintainAspectRatio: false, // 🔥 allows full stretch
      },
    });
  }

  getFilteredData() {
    const data = this.priceHistory();

    const limit =
      this.timeframe() === '1m' ? 60 : this.timeframe() === '2m' ? 120 : 300;

    return data.slice(-limit);
  }

  getPriceClass(stock: any) {
    const prev = this.previousPrice.get(stock.symbol);

    if (prev === undefined) {
      this.previousPrice.set(stock.symbol, stock.price);
      return '';
    }

    const cls = stock.price > prev ? 'up' : stock.price < prev ? 'down' : '';

    this.previousPrice.set(stock.symbol, stock.price);

    return cls;
  }
}
