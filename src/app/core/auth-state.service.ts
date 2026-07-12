import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'Manager' | 'TeamLead' | 'Employee';
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private readonly _user = signal<AuthUser | null>(null);

  readonly user = this._user.asReadonly();

  readonly isLoggedIn = computed(() => this._user() !== null);

  readonly username = computed(() => this._user()?.username ?? '');

  readonly role = computed(() => this._user()?.role ?? '');

  setUser(user: AuthUser) {
    this._user.set(user);
  }

  clearUser() {
    this._user.set(null);
  }

}