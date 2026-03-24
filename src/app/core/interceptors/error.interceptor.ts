import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, Observable, switchMap, throwError, tap, share } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

let refreshing$: Observable<unknown> | null = null;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        if (!refreshing$) {
          refreshing$ = auth.refresh().pipe(
            tap(() => {
              refreshing$ = null;
            }),
            catchError(() => {
              refreshing$ = null;
              notification.warning('Tu sesion ha expirado. Inicia sesion de nuevo.');
              auth.logout();
              return EMPTY;
            }),
            share(),
          );
        }

        return refreshing$.pipe(
          switchMap(() =>
            next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${auth.token()}` },
              }),
            ),
          ),
        );
      }

      if (error.status === 403) {
        notification.error('No tienes permisos para esta accion.');
        return throwError(() => error);
      }

      if (error.status === 0) {
        notification.warning(
          'Sin conexion. Los cambios se guardaran cuando vuelvas a estar online.',
        );
        return EMPTY;
      }

      if (error.status >= 500) {
        notification.error('Error del servidor. Intenta de nuevo mas tarde.');
      }

      return throwError(() => error);
    }),
  );
};
