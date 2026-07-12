import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';

import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { AuthStateService } from '../core/auth-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const authState = inject(AuthStateService);

  const clonedRequest = req.clone({

    withCredentials: true

  });

  return next(clonedRequest).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        authState.clearUser();
        
       
        if (!req.url.includes('/auth/me')) {
          router.navigate(['/login']);
        }

      }

      return throwError(() => error);

    })

  );

};