import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/phonetics-hub/phonetics-hub').then((m) => m.PhoneticsHub),
    title: 'Fonetica',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/phoneme-detail/phoneme-detail').then((m) => m.PhonemeDetail),
    title: 'Fonema',
  },
];

export default routes;
