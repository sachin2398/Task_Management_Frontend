import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
   RouterLink
} from '@angular/router';

import { AuthStateService } from '../../../core/auth-state.service';
import { TaskService } from '../../../services/task.service';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../core/toast.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink

  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {

  private fb = inject(FormBuilder);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private taskService = inject(TaskService);

  private userService = inject(UserService);
  private toastService = inject(ToastService);

  auth = inject(AuthStateService);

  users: any[] = [];

  loading = false;

  submitted = false;

  isEditMode = false;

  taskId: string | null = null;

  taskForm = this.fb.nonNullable.group({

    title: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(5)
      ]
    ],

    status: ['Pending'],

    assignedTo: ['']

  });

  ngOnInit(): void {

    this.taskId = this.route.snapshot.paramMap.get('id');

    this.loadAssignableUsers();

    if (this.taskId) {

      this.isEditMode = true;

      this.loadTask();

    }

  }

  loadAssignableUsers(): void {

    if (this.auth.role() === 'Employee') {

      return;

    }

    this.userService.getAssignableUsers().subscribe({

      next: (response) => {
        
        const activeUser = this.auth.user();
        const apiUsers = response.data || [];
        
        if (activeUser) {
          // Allow Manager and TeamLead to assign tasks to themselves
          this.users = [
            { _id: activeUser.id, username: `${activeUser.username} (Me)`, role: activeUser.role },
            ...apiUsers
          ];
        } else {
          this.users = apiUsers;
        }

      },

      error: (error) => {

        console.error(error);

      }

    });

  }

  loadTask(): void {

    if (!this.taskId) return;

    this.loading = true;

    this.taskService.getTask(this.taskId).subscribe({

      next: (response) => {

        const task = response.data;

        this.taskForm.patchValue({

          title: task.title,

          description: task.description,

          status: task.status,

          assignedTo: task.assignedTo?._id || ''

        });

        this.loading = false;

      },

      error: (error) => {

        this.loading = false;

        console.error(error);

      }

    });

  }

  onSubmit(): void {

    this.submitted = true;

    if (this.taskForm.invalid) {

      this.taskForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    const payload: any = {

      title: this.taskForm.value.title,

      description: this.taskForm.value.description,

      status: this.taskForm.value.status

    };

    if (

      this.auth.role() !== 'Employee' &&

      this.taskForm.value.assignedTo

    ) {

      payload.assignedTo = this.taskForm.value.assignedTo;

    }

    if (this.isEditMode && this.taskId) {

      this.taskService.updateTask(this.taskId, payload)

        .subscribe({

          next: () => {

            this.loading = false;

            this.toastService.success('Task updated successfully');

            this.router.navigate(['/tasks']);

          },

          error: (error) => {

            this.loading = false;

            this.toastService.error(error.error.message || 'Error updating task');

          }

        });

    }

    else {

      this.taskService.createTask(payload)

        .subscribe({

          next: () => {

            this.loading = false;

            this.toastService.success('Task created successfully');

            this.router.navigate(['/tasks']);

          },

          error: (error) => {

            this.loading = false;

            this.toastService.error(error.error.message || 'Error creating task');

          }

        });

    }

  }

}