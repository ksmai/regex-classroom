import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import 'rxjs/add/operator/skip';
import { Observable } from 'rxjs/Observable';

import { UserService } from '../core/user.service';

@Injectable()
export class GuestOnlyGuard implements CanActivate {
  constructor(private userService: UserService) {
  }

  canActivate(): Observable<boolean> {
    return this.userService
      .fetchUser()
      .skip(1)
      .map((user) => !(user && user.name));
  }
}
