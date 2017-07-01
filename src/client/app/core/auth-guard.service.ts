import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import { Observable } from 'rxjs/Observable';

import { UserService } from './user.service';

/**
 * Allows routing to a certain component if and only if user is logged
 * in. Redirects the user otherwise
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.userService
      .fetchUser()
      .skip(1)
      .map((user) => !!(user && user.name))
      .do((allowed) => {
        if (!allowed) {
          this.router.navigate(['/']);
        }
      });
  }
}
