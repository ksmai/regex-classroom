import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { LeaderboardService } from '../core/leaderboard.service';
import { IUser } from '../core/user.service';

@Injectable()
export class LeaderboardResolver implements Resolve<IUser[]> {
  constructor(private leaderboardService: LeaderboardService) {
  }

  resolve() {
    return this.leaderboardService.listUsers(0, 50);
  }
}
