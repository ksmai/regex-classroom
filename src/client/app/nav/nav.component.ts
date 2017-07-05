import {
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IUser, UserService } from '../core/user.service';

/**
 * The navbar at the top for navigation and logout
 * Listens for window scroll event so it can hide itself when scrolling
 * down
 */
@Component({
  selector: 're-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  user: IUser;
  subscription: Subscription;
  isLoggingOut: boolean = false;
  private hideTimeout: any;
  private prevScrollY: number = 0;
  @HostBinding('class.show') private show = true;

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

  @HostListener('window:scroll')
  private onScroll(evt: Event) {
    clearTimeout(this.hideTimeout);
    if (window.scrollY === 0) {
      this.show = true;
    } else if (window.scrollY < 100 || window.scrollY < this.prevScrollY) {
      this.show = true;
      this.hideTimeout = setTimeout(() => this.show = false, 3000);
    } else {
      this.show = false;
    }
    this.prevScrollY = window.scrollY;
  }
}
