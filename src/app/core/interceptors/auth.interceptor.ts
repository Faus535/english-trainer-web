import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, catchError, finalize, share, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../../shared/models/api.model';

const REFRESH_MARGIN_MS = 5 * 60 * 1000;

let proactiveRefresh$: Observable<AuthResponse> | null = null;

function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isTokenExpiringSoon(token: string): boolean {
  const expiry = getTokenExpiry(token);
  if (expiry === null) return false;
  return expiry - Date.now() < REFRESH_MARGIN_MS;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  if (!token || req.url.includes('/auth/')) {
    return next(req);
  }

  if (isTokenExpiringSoon(token)) {
    if (!proactiveRefresh$) {
      proactiveRefresh$ = auth.refresh().pipe(
        finalize(() => {
          proactiveRefresh$ = null;
        }),
        share(),
      );
    }

    return proactiveRefresh$.pipe(
      switchMap(() => {
        const freshToken = auth.token();
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${freshToken}` },
          }),
        );
      }),
      catchError(() => {
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          }),
        );
      }),
    );
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
