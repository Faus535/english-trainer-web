import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../../shared/services/state.service';

export const testCompletedGuard: CanActivateFn = () => {
  const state = inject(StateService);
  const router = inject(Router);

  if (state.testCompleted()) {
    return true;
  }
  return router.createUrlTree(['/level-test']);
};

export const testNotCompletedGuard: CanActivateFn = () => {
  const state = inject(StateService);
  const router = inject(Router);

  if (!state.testCompleted()) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};
