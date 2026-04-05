import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/immerse-hub/immerse-hub').then((m) => m.ImmerseHub),
    title: 'Immerse',
  },
] satisfies Routes;
