import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IUser, UserService } from '../core/user.service';

@Component({
  selector: 're-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  user: IUser;
  subscription: Subscription;
  isLoggingOut: boolean = false;

  constructor(
    private userService: UserService,
    private snackbar: MdSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this
      .userService
      .fetchUser()
      .subscribe((user: IUser) => this.user = user);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.isLoggingOut = true;
    this.userService
      .logout()
      .subscribe((success: boolean) => {
        this.isLoggingOut = false;
        if (success) {
          this.snackbar.open('Bye!', null, { duration: 5000 });
          this.router.navigate(['/']);
        } else {
          this.snackbar.open('An error has occurred!', 'RETRY', {
            duration: 5000,
          })
          .onAction()
          .subscribe(() => {
            this.isLoggingOut = true;
            setTimeout(() => this.logout(), 1500);
          });
        }
      });
  }
}
