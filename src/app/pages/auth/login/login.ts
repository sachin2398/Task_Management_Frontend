import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../core/auth-state.service';
import { ToastService } from '../../../core/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  hidePassword = true;

  loginForm: FormGroup;

  loading = false;

  constructor(

    private fb: FormBuilder,

    private authService: AuthService,

    private authState: AuthStateService,

    private router: Router,

    private toastService: ToastService

  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  togglePassword() {

    this.hidePassword = !this.hidePassword;

  }

  onSubmit() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.authService.login(this.loginForm.value)

      .subscribe({

        next: (response) => {

          this.loading = false;

          this.authState.setUser(response.data);

          this.toastService.success('Login successful!');

          this.router.navigate(['/dashboard']);

        },

        error: (error) => {

          this.loading = false;

          let msg = 'Login failed';
          if (error.error?.message) {
            msg = error.error.message;
          } else if (error.error?.errors && Array.isArray(error.error.errors)) {
            msg = error.error.errors.map((e: any) => e.msg).join(', ');
          } else if (typeof error.error === 'string') {
            msg = error.error;
          } else if (error.message) {
            msg = error.message;
          }
          this.toastService.error(msg);

        }

      });

  }

}