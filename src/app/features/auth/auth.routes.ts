import { Routes } from '@angular/router';

export default [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
    title: 'Iniciar Sesion',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.Register),
    title: 'Registrarse',
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password').then((m) => m.ForgotPassword),
    title: 'Recuperar Contrasena',
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password').then((m) => m.ResetPassword),
    title: 'Restablecer Contrasena',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
] satisfies Routes;
