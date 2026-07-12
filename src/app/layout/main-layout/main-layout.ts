import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    RouterOutlet
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

  sidebarCollapsed = signal(true);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarCollapsed.set(true);
  }

}