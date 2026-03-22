import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/tutor-page/tutor-page').then((m) => m.TutorPage),
    title: 'AI Tutor',
  },
] satisfies Routes;
