import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/writing-list/writing-list').then((m) => m.WritingList),
    title: 'Writing',
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/writing-history/writing-history').then((m) => m.WritingHistory),
    title: 'Historial de escritura',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/writing-exercise/writing-exercise').then((m) => m.WritingExercise),
    title: 'Ejercicio de escritura',
  },
] satisfies Routes;
