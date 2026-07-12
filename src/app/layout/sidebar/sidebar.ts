import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthStateService } from '../../core/auth-state.service';

interface MenuItem {
  title: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  auth = inject(AuthStateService);

  collapsed = input(true);

  closeSidebar = output<void>();

  menus = computed<MenuItem[]>(() => {

    const role = this.auth.role();

    const base: MenuItem[] = [
      { title: 'Dashboard', route: '/dashboard', icon: 'bi-speedometer2' },
      { title: role === 'Employee' ? 'My Tasks' : 'Tasks', route: '/tasks', icon: 'bi-list-task' }
    ];

    if (role === 'Manager') {
      base.push({ title: 'Users', route: '/users', icon: 'bi-people' });
    }

    if (role === 'TeamLead') {
      base.push({ title: 'Employees', route: '/users', icon: 'bi-people' });
    }

    return base;

  });

  onOverlayClick(): void {
    this.closeSidebar.emit();
  }

}