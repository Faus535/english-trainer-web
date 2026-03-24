import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 403) && !req.url.includes('/auth/')) {
        auth.logout();
        return EMPTY;
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
