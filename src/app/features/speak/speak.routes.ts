import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./speak').then(m => m.Speak),
    title: 'Hablar',
  },
] satisfies Routes;
