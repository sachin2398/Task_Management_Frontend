import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SocketService } from '../core/socket.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);
  private socketService = inject(SocketService);

  private apiUrl = environment.apiUrl;

  getTasks(): Observable<any> {
    return this.socketService.emitWithAck('task:getAll');
  }

  getTask(id: string): Observable<any> {
    return this.socketService.emitWithAck('task:getById', { id });
  }

  createTask(task: Task): Observable<any> {
    return this.socketService.emitWithAck('task:create', task);
  }

  updateTask(id: string, task: Task): Observable<any> {
    return this.socketService.emitWithAck('task:update', { id, ...task });
  }

  assignTask(id: string, assignedTo: string): Observable<any> {
    return this.socketService.emitWithAck('task:assign', { id, assignedTo });
  }

  updateTaskStatus(id: string, status: string): Observable<any> {
    return this.socketService.emitWithAck('task:updateStatus', { id, status });
  }

  deleteTask(id: string): Observable<any> {
    return this.socketService.emitWithAck('task:delete', { id });
  }

}