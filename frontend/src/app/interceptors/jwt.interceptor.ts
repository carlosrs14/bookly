import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  // Clone request with auth header if token exists
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Try to refresh token on 401 (skip refresh endpoint itself)
      if (error.status === 401 && !req.url.includes('auth/refresh') && !req.url.includes('auth/login')) {
        const refreshObs = auth.refreshToken();
        if (refreshObs) {
          return refreshObs.pipe(
            switchMap(() => {
              const newToken = auth.getAccessToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq);
            }),
            catchError(() => {
              auth.logout();
              return throwError(() => error);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};