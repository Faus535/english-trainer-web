import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

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
    path: 'article',
    canActivate: [authGuard],
    loadChildren: () => import('./features/article/article.routes'),
  },
  {
    path: 'review',
    canActivate: [authGuard],
    loadChildren: () => import('./features/review/review.routes'),
    title: 'Review',
  },
  {
    path: 'pronunciation',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/pronunciation/pronunciation.routes').then((r) => r.pronunciationRoutes),
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
];
