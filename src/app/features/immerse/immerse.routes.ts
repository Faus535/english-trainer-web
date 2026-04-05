import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('../home/pages/home-page/home-page').then((m) => m.HomePage),
  },
] satisfies Routes;
