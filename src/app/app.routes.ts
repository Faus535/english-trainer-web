import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page').then((m) => m.HomePage),
    title: 'Home',
  },
  {
    path: 'talk',
    canActivate: [authGuard],
    loadChildren: () => import('./features/talk/talk.routes'),
  },
  {
    path: 'immerse',
    canActivate: [authGuard],
    loadChildren: () => import('./features/immerse/immerse.routes'),
  },
  {
    path: 'review',
    canActivate: [authGuard],
    loadChildren: () => import('./features/review/review.routes'),
    title: 'Review',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
    title: 'Profile',
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/notification-settings').then((m) => m.NotificationSettings),
    title: 'Notifications',
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
    title: 'Settings',
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes'),
    title: 'Admin',
  },
  // Legacy redirects
  { path: 'dashboard', redirectTo: 'home' },
  { path: 'speak', redirectTo: 'home' },
  { path: 'level-test', redirectTo: 'home' },
  { path: 'achievements', redirectTo: 'home' },
  { path: 'session', redirectTo: 'home' },
  { path: 'minimal-pairs', redirectTo: 'home' },
  { path: 'tutor', redirectTo: 'home' },
  { path: 'games', redirectTo: 'home' },
  { path: 'phonetics', redirectTo: 'home' },
  { path: 'practice', redirectTo: 'home' },
  { path: 'reading', redirectTo: 'home' },
  { path: 'writing', redirectTo: 'home' },
  { path: 'analytics', redirectTo: 'home' },
];
