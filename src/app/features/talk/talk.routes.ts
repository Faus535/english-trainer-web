import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/scenario-select/scenario-select').then((m) => m.ScenarioSelect),
    title: 'Talk - Choose Scenario',
  },
] satisfies Routes;
