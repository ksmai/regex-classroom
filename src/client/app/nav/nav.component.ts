import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private userService: UserService) {
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
}
