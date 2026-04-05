import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/scenario-select/scenario-select').then((m) => m.ScenarioSelect),
    title: 'Talk - Choose Scenario',
  },
  {
    path: 'conversation',
    loadComponent: () =>
      import('./pages/talk-conversation/talk-conversation').then((m) => m.TalkConversation),
    title: 'Talk - Conversation',
  },
  {
    path: 'summary',
    loadComponent: () => import('./pages/talk-summary/talk-summary').then((m) => m.TalkSummary),
    title: 'Talk - Summary',
  },
] satisfies Routes;
