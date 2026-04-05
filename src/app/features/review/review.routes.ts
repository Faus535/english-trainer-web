import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/review-page/review-page').then((m) => m.ReviewPage),
    title: 'Review',
  },
  {
    path: 'stats',
    loadComponent: () => import('./pages/review-stats/review-stats').then((m) => m.ReviewStats),
    title: 'Review Stats',
  },
] satisfies Routes;
