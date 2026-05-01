import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./features/portfolio/portfolio').then((m) => m.Portfolio),
  },
  {
    path: 'stock/:symbol',
    loadComponent: () =>
      import('./features/stock-detail/stock-detail').then((m) => m.StockDetail),
  },
];
