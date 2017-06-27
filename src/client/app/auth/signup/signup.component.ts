import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../../core/user.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  pending: boolean = false;
  private nameTimeout: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackbar: MdSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z0-9_\-\. ]{3,20}$/),
      ], this.nameAvailable.bind(this)],
      passwords: this.formBuilder.group({
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
        ]],
        confirmPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
        ]],
      }, { validator: this.passwordMatch }),
    });
  }

  onSubmit(): void {
    const username = this.form.get('username').value;
    const password = this.form.get('passwords.password').value;
    this.pending = true;
    this.userService
      .signup(username, password)
      .subscribe((success: boolean) => {
        this.pending = false;
        if (success) {
          this.snackbar.open(`Welcome, ${username}!`, null, {
            duration: 5000,
          });
          this.router.navigate(['/']);
        } else {
          this.snackbar.open('An error has occurred!', 'RETRY', {
            duration: 5000,
          })
          .onAction()
          .subscribe(() => {
            this.pending = true;
            setTimeout(() => this.onSubmit(), 1500);
          });
        }
      });
  }

  get nameError() {
    const errors = this.form.get('username').errors;
    if (!errors) {
      return '';
    } else if (errors.required) {
      return 'Required';
    } else if (errors.minlength) {
      return `${errors.minlength.actualLength} / ${errors.minlength.requiredLength}`;
    } else if (errors.maxlength) {
      return `${errors.maxlength.actualLength} / ${errors.maxlength.requiredLength}`;
    } else if (errors.nameNotAvailable) {
      return 'This name has been taken';
    } else if (errors.pattern) {
      return 'Illegal characters';
    }
  }

  get passwordError() {
    const errors = this.form.get('passwords.password').errors;
    if (!errors) {
      return '';
    } else if (errors.required) {
      return 'Required';
    } else if (errors.minlength) {
      return `${errors.minlength.actualLength} / ${errors.minlength.requiredLength}`;
    } else if (errors.maxlength) {
      return `${errors.maxlength.actualLength} / ${errors.maxlength.requiredLength}`;
    }
  }

  get confirmPasswordError() {
    const errors = this.form.get('passwords.confirmPassword').errors;
    if (!errors) {
      return '';
    } else if (errors.required) {
      return 'Required';
    } else if (errors.minlength) {
      return `${errors.minlength.actualLength} / ${errors.minlength.requiredLength}`;
    } else if (errors.maxlength) {
      return `${errors.maxlength.actualLength} / ${errors.maxlength.requiredLength}`;
    }
  }

  get nameHint() {
    const name = this.form.get('username').value;
    if (name.length > 15) {
      return `${name.length} / 20`;
    } else {
      return '';
    }
  }

  get passwordHint() {
    const password = this.form.get('passwords.password').value;
    const match = !this.form.get('passwords').errors;

    if (password.length > 0 && !match) {
      return 'Passwords do not match';
    } else if (password.length > 25) {
      return `${password.length} / 30`;
    } else {
      return '';
    }
  }

  get confirmPasswordHint() {
    const password = this.form.get('passwords.confirmPassword').value;
    const match = !this.form.get('passwords').errors;

    if (password.length > 0 && !match) {
      return 'Passwords do not match';
    } else if (password.length > 25) {
      return `${password.length} / 30`;
    } else {
      return '';
    }
  }

  private passwordMatch(formGroup: FormGroup): ValidationErrors {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;
    if (password === confirmPassword) {
      return null;
    } else {
      return {
        passwordNotMatch: true,
      };
    }
  }

  private nameAvailable(control: FormControl): Promise<ValidationErrors> {
    clearTimeout(this.nameTimeout);
    return new Promise((resolve) => {
      this.nameTimeout = setTimeout(() => {
        this.userService
          .isNameAvailable(control.value)
          .subscribe((available: boolean) => {
            if (available) {
              resolve(null);
            } else {
              resolve({ nameNotAvailable: true });
            }
          });
      }, 300);
    });
  }
}
