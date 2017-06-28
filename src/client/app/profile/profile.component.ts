import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IUser, UserService } from '../core/user.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user$: Observable<IUser>;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.user$ = this.userService.fetchUser();
  }

  experience(level: number) {
    return Math.round((level % 1) * 100);
  }
}
