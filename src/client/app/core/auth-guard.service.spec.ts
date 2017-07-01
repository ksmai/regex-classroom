import { ReflectiveInjector } from '@angular/core';
import { Router } from '@angular/router';

import { FakeRouter, FakeUserService } from '../../test_utils';
import { AuthGuard } from './auth-guard.service';
import { UserService } from './user.service';

describe('AuthGuard', () => {
  let userService: FakeUserService;
  let router: FakeRouter;
  let authGuard: AuthGuard;
  let injector: ReflectiveInjector;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: UserService, useClass: FakeUserService },
      { provide: Router, useClass: FakeRouter },
      AuthGuard,
    ]);
    userService = injector.get(UserService);
    router = injector.get(Router);
    authGuard = injector.get(AuthGuard);
  });

  it('should return false if not logged in', (done) => {
    authGuard.canActivate().subscribe((allowed: boolean) => {
      expect(allowed).toBe(false);
      done();
    });
    userService.user$.next(null);
  });

  it('should redirect if not logged in', (done) => {
    const spy = spyOn(router, 'navigate');
    authGuard.canActivate().subscribe((allowed: boolean) => {
      expect(spy).toHaveBeenCalled();
      done();
    });
    userService.user$.next(null);
  });

  it('should return true if logged in', (done) => {
    authGuard.canActivate().subscribe((allowed: boolean) => {
      expect(allowed).toBe(true);
      done();
    });
    userService.user$.next({ name: 'hello' });
  });
});
