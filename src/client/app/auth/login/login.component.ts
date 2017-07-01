import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { UserService } from '../../core/user.service';

/**
 * Renders the login form and handles validation logic
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  pending: boolean = false;
  @ViewChild('nameEl') private nameEl: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackbar: MdSnackBar,
  ) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.nameEl.nativeElement.focus(), 0);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z0-9_\-\. ]{3,20}$/),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
      ]],
    });
  }

  onSubmit(): void {
    if (!this.form.valid && !this.form.disabled) {
      this.pending = false;
      this.form.enable();
      return;
    }
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;
    this.pending = true;
    this.form.disable();
    this.userService
      .login(username, password)
      .subscribe((success: boolean) => {
        this.pending = false;
        this.form.enable();
        if (success) {
          this.snackbar.open(`Welcome back, ${username}!`, null, {
            duration: 5000,
          });
          this.router.navigate(['/']);
        } else {
          this.snackbar.open('Invalid username/password', null, {
            duration: 5000,
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
    } else if (errors.pattern) {
      return 'Illegal characters';
    }
  }

  get passwordError() {
    const errors = this.form.get('password').errors;
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
    const password = this.form.get('password').value;

    if (password.length > 25) {
      return `${password.length} / 30`;
    } else {
      return '';
    }
  }
}
