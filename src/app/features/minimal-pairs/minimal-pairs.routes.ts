import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/minimal-pairs-page/minimal-pairs-page').then((m) => m.MinimalPairsPage),
    title: 'Pares Minimos',
  },
] satisfies Routes;
