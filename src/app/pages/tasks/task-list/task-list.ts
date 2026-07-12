import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TaskService } from '../../../services/task.service';
import { AuthStateService } from '../../../core/auth-state.service';
import { ToastService } from '../../../core/toast.service';
import { ConfirmService } from '../../../core/confirm.service';
import { SocketService } from '../../../core/socket.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private socketService = inject(SocketService);
  auth = inject(AuthStateService);

  tasks = signal<Task[]>([]);
  loading = signal(true);
  private subscriptions: Subscription = new Subscription();
  
  searchQuery = signal('');
  statusFilter = signal('All');

  totalCount = computed(() => this.tasks().length);
  pendingCount = computed(() => this.tasks().filter(t => t.status === 'Pending').length);
  completedCount = computed(() => this.tasks().filter(t => t.status === 'Completed').length);

  filteredTasks = computed(() => {
    let result = this.tasks();
    
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = this.tasks().filter(t => {

      const matchTitle = t.title.toLowerCase().includes(query);
      const matchDesc = t.description.toLowerCase().includes(query);
      
      const assignedName = t.assignedTo ? (t.assignedTo.username || t.assignedTo.name || '').toLowerCase() : '';
      const matchUser = assignedName.includes(query);

      return matchTitle || matchDesc || matchUser;

    });
    }
    
    const status = this.statusFilter();
    if (status !== 'All') {
      result = result.filter(t => t.status === status);
    }
    
    return result;
  });

  ngOnInit(): void {
    this.loadTasks();

    // Listen for real-time updates and mutate local state directly
    this.subscriptions.add(
      this.socketService.on<Task>('task:created').subscribe(task => {
        this.tasks.update(tasks => [task, ...tasks]);
      })
    );
    this.subscriptions.add(
      this.socketService.on<Task>('task:updated').subscribe(updatedTask => {
        this.tasks.update(tasks => tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      })
    );
    this.subscriptions.add(
      this.socketService.on<Task>('task:statusChanged').subscribe(updatedTask => {
        this.tasks.update(tasks => tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      })
    );
    this.subscriptions.add(
      this.socketService.on<Task>('task:assigned').subscribe(updatedTask => {
        this.tasks.update(tasks => tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      })
    );
    this.subscriptions.add(
      this.socketService.on<{_id: string}>('task:deleted').subscribe(data => {
        this.tasks.update(tasks => tasks.filter(t => t._id !== data._id));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTasks() {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks.set(response.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  async deleteTask(id: string | undefined) {
    if (!id) return;
    
    const confirmed = await this.confirmService.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks.update(tasks => tasks.filter(t => t._id !== id));
          this.toastService.success('Task deleted successfully');
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Error deleting task');
        }
      });
    }
  }

  toggleStatus(task: Task) {
    if (!task._id) return;
    
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    
    this.taskService.updateTaskStatus(task._id, newStatus).subscribe({
      next: () => {
        this.tasks.update(tasks => 
          tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t)
        );
        this.toastService.success('Task status updated successfully');
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Error updating task status');
      }
    });
  }
}