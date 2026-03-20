import { Routes } from '@angular/router';
import { testCompletedGuard, testNotCompletedGuard } from './core/guards/test-completed.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'level-test',
    canActivate: [testNotCompletedGuard],
    loadComponent: () => import('./features/level-test/level-test').then(m => m.LevelTest),
    title: 'Test de Nivel',
  },
  {
    path: 'dashboard',
    canActivate: [testCompletedGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Dashboard',
  },
  {
    path: 'speak',
    canActivate: [testCompletedGuard],
    loadChildren: () => import('./features/speak/speak.routes'),
  },
  {
    path: 'achievements',
    canActivate: [testCompletedGuard],
    loadComponent: () => import('./features/dashboard/pages/achievements/achievements').then(m => m.Achievements),
    title: 'Logros',
  },
  {
    path: 'session',
    canActivate: [testCompletedGuard],
    loadComponent: () => import('./features/dashboard/pages/session/session').then(m => m.Session),
    title: 'Sesion',
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings').then(m => m.Settings),
    title: 'Ajustes',
  },
];
