import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { environment } from '../services/environment';
import { CurrentUserResponse } from '../../shared/models/api.model';

export const adminGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<CurrentUserResponse>(`${environment.apiUrl}/auth/me`).pipe(
    map((user) => (user.role === 'ADMIN' ? true : router.createUrlTree(['/home']))),
    catchError(() => of(router.createUrlTree(['/auth/login']))),
  );
};
