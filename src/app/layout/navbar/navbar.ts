import { Component, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../core/auth-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  auth = inject(AuthStateService);

  private authService = inject(AuthService);

  private router = inject(Router);

  toggleSidebar = output<void>();

  ngOnInit(): void {
    if (!this.auth.user()) {
      this.authService.getMe().subscribe({
        next: (response) => {
          this.auth.setUser(response.data);
        }
      });
    }
  }

  getInitials(): string {
    const name = this.auth.username();
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  getRoleBadgeClass(): string {
    const role = this.auth.role();
    if (role === 'Manager') return 'badge-manager';
    if (role === 'TeamLead') return 'badge-teamlead';
    return 'badge-employee';
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.auth.clearUser();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout API failed:', err);
        // Fallback: clear local state and navigate to login anyway
        this.auth.clearUser();
        this.router.navigate(['/login']);
      }
    });
  }

}