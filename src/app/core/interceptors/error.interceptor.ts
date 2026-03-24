import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, Observable, switchMap, throwError, finalize, share } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthResponse } from '../../shared/models/api.model';

let refreshing$: Observable<AuthResponse> | null = null;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        if (!refreshing$) {
          refreshing$ = auth.refresh().pipe(
            finalize(() => {
              refreshing$ = null;
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
          catchError((refreshError: HttpErrorResponse) => {
            if (refreshError.status === 401 || refreshError.status === 403) {
              auth.logout();
            } else {
              notification.warning('Sin conexion. Se reintentara automaticamente.');
            }
            return EMPTY;
          }),
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
