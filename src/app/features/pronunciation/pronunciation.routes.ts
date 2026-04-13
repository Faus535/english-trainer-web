import { Routes } from '@angular/router';

export const pronunciationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/pronunciation-lab/pronunciation-lab'),
  },
  {
    path: 'drills',
    loadComponent: () => import('./pages/pronunciation-drills/pronunciation-drills'),
  },
  {
    path: 'mini-conversation',
    loadComponent: () =>
      import('./pages/pronunciation-mini-conversation/pronunciation-mini-conversation'),
  },
  {
    path: 'mini-conversation/summary',
    loadComponent: () => import('./pages/pronunciation-mini-summary/pronunciation-mini-summary'),
  },
];
