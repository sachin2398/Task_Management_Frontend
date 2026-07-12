import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  register(data: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/register`,
      data
    );

  }

  login(data: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/login`,
      data
    );

  }

  logout(): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      {}
    );

  }

  getMe(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/auth/me`
    );

  }

}