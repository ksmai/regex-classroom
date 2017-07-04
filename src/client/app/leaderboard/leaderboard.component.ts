import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/pluck';
import { Observable } from 'rxjs/Observable';

import { IUser, UserService } from '../core/user.service';

/**
 * Renders the leaderboard showing the users with highest level and
 * most badges
 */
@Component({
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  userList: Observable<IUser[]>;
  me: IUser;

  constructor(
    private routes: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.userList = this.routes.data.pluck('users');
    this.userService.getUser().subscribe((user) => this.me = user);
  }
}
