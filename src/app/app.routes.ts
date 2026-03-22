import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'level-test',
    canActivate: [authGuard],
    loadComponent: () => import('./features/level-test/level-test').then((m) => m.LevelTest),
    title: 'Test de Nivel',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
  },
  {
    path: 'speak',
    canActivate: [authGuard],
    loadChildren: () => import('./features/speak/speak.routes'),
  },
  {
    path: 'achievements',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/achievements/achievements').then((m) => m.Achievements),
    title: 'Logros',
  },
  {
    path: 'session',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/session/session').then((m) => m.Session),
    title: 'Sesion',
  },
  {
    path: 'tutor',
    canActivate: [authGuard],
    loadChildren: () => import('./features/tutor/tutor.routes'),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
    title: 'Ajustes',
  },
];
