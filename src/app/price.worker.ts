/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const stocks = data;

  const updated = stocks.map((stock: any) => ({
    ...stock,
    price: +(stock.price + (Math.random() - 0.5)).toFixed(2),
  }));

  postMessage(updated);
});

/**
 * 
 * App starts
   ↓
StockStore constructor runs
   ↓
Worker is created
   ↓
Loop starts (every 500ms)
   ↓
Stocks sent to Worker
   ↓
Worker updates prices
   ↓
Worker sends back data
   ↓
Signal updates
   ↓
Angular UI re-renders
 */
