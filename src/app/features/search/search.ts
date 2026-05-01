import { Component, computed, inject, signal } from '@angular/core';
import { StockStore } from '../../core/services/stock.store';
import { NgForOf } from "../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-search',
  imports: [NgForOf],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  store = inject(StockStore);
  search = signal('');

  // filteredStocks = computed(() => {
  //   return this.store
  //     .stocks()
  //     .filter((s) =>
  //       s.symbol.toLowerCase().includes(this.search().toLowerCase()),
  //     );
  // });
}
