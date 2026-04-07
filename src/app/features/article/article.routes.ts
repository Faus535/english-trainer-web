import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/article-hub/article-hub').then((m) => m.ArticleHub),
    title: 'Article',
  },
  {
    path: ':articleId',
    loadComponent: () =>
      import('./pages/article-reader/article-reader').then((m) => m.ArticleReader),
    title: 'Article - Read',
  },
  {
    path: ':articleId/questions',
    loadComponent: () =>
      import('./pages/article-questions/article-questions').then((m) => m.ArticleQuestions),
    title: 'Article - Questions',
  },
] satisfies Routes;
