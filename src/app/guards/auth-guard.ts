import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../core/auth-state.service';

import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isLoggedIn()) {
    return true;
  }

  return authService.getMe().pipe(

    map((response) => {
      authState.setUser(response.data);
      return true;
    }),

    catchError(() => {

      router.navigate(['/login']);

      return of(false);

    })

  );

};