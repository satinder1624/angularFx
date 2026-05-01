import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StockStore } from '../../core/services/stock.store';
import { DecimalPipe, NgForOf, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, DecimalPipe, NgClass, ScrollingModule],
})
export class Home {
  store = inject(StockStore);
  router = inject(Router);
  stocks = this.store.stocks;

  private previousPrices = new Map<string, number>();

  trackBySymbol(index: number, stock: any) {
    return stock.symbol;
  }

  goToStock(symbol: string) {
    this.router.navigate(['/stock', symbol]);
  }

  getPriceClass(stock: any) {
    const prev = this.previousPrices.get(stock.symbol);

    if (prev === undefined) {
      this.previousPrices.set(stock.symbol, stock.price);
      return '';
    }

    const className =
      stock.price > prev ? 'up' : stock.price < prev ? 'down' : '';

    this.previousPrices.set(stock.symbol, stock.price);

    return className;
  }
}
