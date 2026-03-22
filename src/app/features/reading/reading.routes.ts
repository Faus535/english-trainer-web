import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/reading-list/reading-list').then((m) => m.ReadingList),
    title: 'Reading',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/reading-detail/reading-detail').then((m) => m.ReadingDetail),
    title: 'Lectura',
  },
  {
    path: ':id/quiz',
    loadComponent: () => import('./pages/reading-quiz/reading-quiz').then((m) => m.ReadingQuiz),
    title: 'Comprension',
  },
] satisfies Routes;
