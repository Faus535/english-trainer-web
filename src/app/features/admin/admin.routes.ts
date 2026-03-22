import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
    title: 'Admin',
  },
  {
    path: 'vocab',
    loadComponent: () => import('./pages/admin-vocab/admin-vocab').then((m) => m.AdminVocab),
    title: 'Admin - Vocabulario',
  },
  {
    path: 'phrases',
    loadComponent: () => import('./pages/admin-phrases/admin-phrases').then((m) => m.AdminPhrases),
    title: 'Admin - Frases',
  },
  {
    path: 'reading',
    loadComponent: () => import('./pages/admin-reading/admin-reading').then((m) => m.AdminReading),
    title: 'Admin - Reading',
  },
  {
    path: 'writing',
    loadComponent: () => import('./pages/admin-writing/admin-writing').then((m) => m.AdminWriting),
    title: 'Admin - Writing',
  },
] satisfies Routes;
