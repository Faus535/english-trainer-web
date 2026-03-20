import { Routes } from '@angular/router';

export default [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login),
    title: 'Iniciar Sesion',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then(m => m.Register),
    title: 'Registrarse',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
] satisfies Routes;
