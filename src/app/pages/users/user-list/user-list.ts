import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../services/user.service';
import { AuthStateService } from '../../../core/auth-state.service';
import { User } from '../../../models/task.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  private userService = inject(UserService);
  auth = inject(AuthStateService);

  users = signal<User[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  totalCount = computed(() => this.users().length);
  managerCount = computed(() => this.users().filter(u => u.role === 'Manager').length);
  teamLeadCount = computed(() => this.users().filter(u => u.role === 'TeamLead').length);
  employeeCount = computed(() => this.users().filter(u => u.role === 'Employee').length);

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.users();
    
    return this.users().filter(u => {
      const name = (u.username || u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const role = (u.role || '').toLowerCase();
      return name.includes(query) || email.includes(query) || role.includes(query);
    });
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    
    const role = this.auth.role();
    
    let request$;
    if (role === 'Manager') {
      request$ = this.userService.getUsers();
    } else if (role === 'TeamLead') {
      request$ = this.userService.getEmployees();
    } else {
      this.loading.set(false);
      return;
    }

    request$.subscribe({
      next: (response) => {
        this.users.set(response.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}
