import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  
  getAllUsers(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/users`
    );

  }


  getEmployees(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/users/employees`
    );

  }


  getTeamLeads(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/users/team-leads`
    );

  }

  getAssignableUsers(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/users/assignable`
    );

  }

}