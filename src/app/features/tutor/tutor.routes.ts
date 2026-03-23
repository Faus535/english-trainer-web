import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/tutor-page/tutor-page').then((m) => m.TutorPage),
    title: 'AI Tutor',
  },
  {
    path: 'exercises/:conversationId',
    loadComponent: () =>
      import('./pages/conversation-exercises/conversation-exercises').then(
        (m) => m.ConversationExercises,
      ),
    title: 'Ejercicios',
  },
  {
    path: 'errors',
    loadComponent: () => import('./pages/error-history/error-history').then((m) => m.ErrorHistory),
    title: 'Historial de errores',
  },
] satisfies Routes;
