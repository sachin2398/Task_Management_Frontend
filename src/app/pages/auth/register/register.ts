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

  selector: 'app-register',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterLink

  ],

  templateUrl: './register.html',

  styleUrl: './register.css'

})

export class Register {

  hidePassword = true;

  loading = false;

  submitted = false;

  registerForm: FormGroup;

  constructor(

    private fb: FormBuilder,

    private authService: AuthService,

    private authState: AuthStateService,

    private router: Router,

    private toastService: ToastService

  ) {

    this.registerForm = this.fb.group({

      username: [

        '',

        [

          Validators.required,

          Validators.minLength(3)

        ]

      ],

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

      ],

      role: [

        '',

        Validators.required

      ]

    });

  }

  togglePassword() {

    this.hidePassword = !this.hidePassword;

  }

  onSubmit() {

    this.submitted = true;

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.authService

      .register(this.registerForm.value)

      .subscribe({

        next: (response) => {

          this.loading = false;

          this.authState.setUser(response.data);

          this.toastService.success('Registration successful!');

          this.router.navigate(['/dashboard']);

        },

        error: (error) => {

          this.loading = false;

          let msg = 'Registration failed';
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