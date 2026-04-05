import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/immerse-hub/immerse-hub').then((m) => m.ImmerseHub),
    title: 'Immerse',
  },
  {
    path: ':contentId',
    loadComponent: () =>
      import('./pages/immerse-reader/immerse-reader').then((m) => m.ImmerseReader),
    title: 'Immerse - Reader',
  },
  {
    path: ':contentId/exercises',
    loadComponent: () =>
      import('./pages/immerse-exercises/immerse-exercises').then((m) => m.ImmerseExercises),
    title: 'Immerse - Exercises',
  },
] satisfies Routes;
