import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

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
    path: 'minimal-pairs',
    canActivate: [authGuard],
    loadChildren: () => import('./features/minimal-pairs/minimal-pairs.routes'),
    title: 'Pares Minimos',
  },
  {
    path: 'tutor',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/tutor/tutor.routes'),
  },
  {
    path: 'games',
    canActivate: [authGuard],
    loadChildren: () => import('./features/games/games.routes'),
    title: 'Juegos',
  },
  {
    path: 'practice',
    canActivate: [authGuard],
    loadComponent: () => import('./features/practice/practice-hub').then((m) => m.PracticeHub),
    title: 'Mejorar',
  },
  {
    path: 'reading',
    canActivate: [authGuard],
    loadChildren: () => import('./features/reading/reading.routes'),
    title: 'Reading',
  },
  {
    path: 'writing',
    canActivate: [authGuard],
    loadChildren: () => import('./features/writing/writing.routes'),
    title: 'Writing',
  },
  {
    path: 'review',
    canActivate: [authGuard],
    loadChildren: () => import('./features/review/review.routes'),
    title: 'Repaso',
  },
  {
    path: 'analytics',
    canActivate: [authGuard],
    loadComponent: () => import('./features/analytics/analytics').then((m) => m.Analytics),
    title: 'Progreso',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
    title: 'Mi Perfil',
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/notification-settings').then((m) => m.NotificationSettings),
    title: 'Notificaciones',
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
    title: 'Ajustes',
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes'),
    title: 'Admin',
  },
];
