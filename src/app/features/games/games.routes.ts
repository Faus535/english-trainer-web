import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/games-hub/games-hub').then((m) => m.GamesHub),
    title: 'Juegos',
  },
  {
    path: 'word-match',
    loadComponent: () => import('./pages/word-match/word-match').then((m) => m.WordMatch),
    title: 'Empareja palabras',
  },
  {
    path: 'fill-gap',
    loadComponent: () => import('./pages/fill-gap/fill-gap').then((m) => m.FillGap),
    title: 'Completa la frase',
  },
  {
    path: 'unscramble',
    loadComponent: () => import('./pages/unscramble/unscramble').then((m) => m.Unscramble),
    title: 'Ordena las letras',
  },
] satisfies Routes;
