import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/review-page/review-page').then((m) => m.ReviewPage),
    title: 'Repaso',
  },
] satisfies Routes;
