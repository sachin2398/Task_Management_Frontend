import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthStateService } from '../../core/auth-state.service';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { SocketService } from '../../core/socket.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  auth = inject(AuthStateService);
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private socketService = inject(SocketService);

  loading = signal(true);
  tasks = signal<Task[]>([]);
  totalTasks = signal(0);
  pendingTasks = signal(0);
  completedTasks = signal(0);
  recentTasks = signal<Task[]>([]);
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    if (!this.auth.user()) {
      this.authService.getMe().subscribe({
        next: (response) => {
          this.auth.setUser(response.data);
          this.loadTasks();
        },
        error: () => {
          this.loading.set(false);
        }
      });
    } else {
      this.loadTasks();
    }

    
    this.subscriptions.add(
      this.socketService.on<Task>('task:created').subscribe(task => {
        this.tasks.update(tasks => [task, ...tasks]);
        this.updateStats();
      })
    );
    this.subscriptions.add(
      this.socketService.on<Task>('task:updated').subscribe(updatedTask => {
        this.tasks.update(tasks => tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        this.updateStats();
      })
    );
    this.subscriptions.add(
      this.socketService.on<Task>('task:statusChanged').subscribe(updatedTask => {
        this.tasks.update(tasks => tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        this.updateStats();
      })
    );
    this.subscriptions.add(
      this.socketService.on<Task>('task:assigned').subscribe(updatedTask => {
        this.tasks.update(tasks => tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        this.updateStats();
      })
    );
    this.subscriptions.add(
      this.socketService.on<{_id: string}>('task:deleted').subscribe(data => {
        this.tasks.update(tasks => tasks.filter(t => t._id !== data._id));
        this.updateStats();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateStats(): void {
    const allTasks = this.tasks();
    this.totalTasks.set(allTasks.length);
    this.pendingTasks.set(allTasks.filter(t => t.status === 'Pending').length);
    this.completedTasks.set(allTasks.filter(t => t.status === 'Completed').length);
    this.recentTasks.set(allTasks.slice(0, 5));
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        const allTasks: Task[] = response.data || [];
        this.tasks.set(allTasks);
        this.updateStats();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching tasks', error);
        this.loading.set(false);
      }
    });
  }
}