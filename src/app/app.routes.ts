import { Routes } from '@angular/router';

import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';

import { Dashboard } from './pages/dashboard/dashboard';

import { TaskList } from './pages/tasks/task-list/task-list';
import { TaskForm } from './pages/tasks/task-form/task-form';

import { UserList } from './pages/users/user-list/user-list';

import { MainLayout } from './layout/main-layout/main-layout';

import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ===========================
  // Guest Routes
  // ===========================

  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },

  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard]
  },

  // ===========================
  // Protected Routes
  // ===========================

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'tasks',
        component: TaskList
      },

      {
        path: 'tasks/create',
        component: TaskForm
      },

      {
        path: 'tasks/edit/:id',
        component: TaskForm
      },

      {
        path: 'users',
        component: UserList
      }

    ]

  },

  // ===========================

  {
    path: '**',
    redirectTo: 'login'
  }

];