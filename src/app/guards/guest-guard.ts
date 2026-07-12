import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

import { map, catchError, of } from 'rxjs';

export const guestGuard: CanActivateFn = () => {

  const authService = inject(AuthService);

  const router = inject(Router);

  return authService.getMe().pipe(

    map(() => {

      router.navigate(['/dashboard']);

      return false;

    }),

    catchError(() => {

      return of(true);

    })

  );

};