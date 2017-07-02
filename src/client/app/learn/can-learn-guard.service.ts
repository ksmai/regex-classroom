import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/zip';
import { Observable } from 'rxjs/Observable';

import { ILevel, LevelService } from '../core/level.service';
import { IUser, UserService } from '../core/user.service';

/**
 * Guarding the learn routes based on user progress on previous level
 */
@Injectable()
export class CanLearnGuard implements CanActivate {
  constructor(
    private levelService: LevelService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.userService
      .fetchUser()
      .skip(1)
      .zip(this.levelService.getLevels())
      .take(1)
      .map(([user, levels]) => {
        const difficulty = Math.round(Number(route.params.difficulty));
        const validDifficulty = difficulty >= 0 &&
          levels.length > difficulty;
        const enoughProgress = difficulty === 0 ||
          user && user.progress[difficulty - 1] > 0;
        if (!validDifficulty || !enoughProgress) {
          this.router.navigate(['/']);
          return false;
        }

        return true;
      });
  }
}
