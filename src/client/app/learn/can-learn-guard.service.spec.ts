import { ReflectiveInjector } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import {
  FakeLevelService,
  FakeRouter,
  FakeUserService,
} from '../../test_utils';
import { ILevel, ITest, LevelService } from '../core/level.service';
import { IUser, UserService } from '../core/user.service';
import { CanLearnGuard } from './can-learn-guard.service';

const fakeLevels: ILevel[] = [
  { difficulty: 0, name: 'Zero', id: '0', tests: [] as ITest[] },
  { difficulty: 1, name: 'One', id: '1', tests: [] as ITest[] },
  { difficulty: 2, name: 'Two', id: '2', tests: [] as ITest[] },
  { difficulty: 3, name: 'Three', id: '3', tests: [] as ITest[] },
];

const fakeUser: IUser = {
  name: 'me',
  id: '456',
  progress: [3, 4, 0],
  level: 0.7,
  badges: [],
};

describe('CanLearnGuard', () => {
  let injector: ReflectiveInjector;
  let router: FakeRouter;
  let userService: FakeUserService;
  let levelService: FakeLevelService;
  let guard: CanLearnGuard;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: Router, useClass: FakeRouter },
      { provide: UserService, useClass: FakeUserService },
      { provide: LevelService, useClass: FakeLevelService },
      CanLearnGuard,
    ]);
    router = injector.get(Router);
    navigateSpy = spyOn(router, 'navigate');
    guard = injector.get(CanLearnGuard);
    userService = injector.get(UserService);
    levelService = injector.get(LevelService);
  });

  it('should allow user to learn if enough progress', (done) => {
    const routes = {
      params: { difficulty: 2 },
    } as any as ActivatedRouteSnapshot;
    guard.canActivate(routes).subscribe((allowed) => {
      expect(allowed).toBe(true);
      expect(navigateSpy).not.toHaveBeenCalled();
      done();
    });
    userService.user$.next(fakeUser);
    levelService.levels$.next(fakeLevels);
  });

  it('should disallow user to learn if not enough progress', (done) => {
    const routes = {
      params: { difficulty: 3 },
    } as any as ActivatedRouteSnapshot;
    guard.canActivate(routes).subscribe((allowed) => {
      expect(allowed).toBe(false);
      expect(navigateSpy).toHaveBeenCalled();
      done();
    });
    userService.user$.next(fakeUser);
    levelService.levels$.next(fakeLevels);
  });

  it('should disallow user to learn if invalid difficulty', (done) => {
    const routes = {
      params: { difficulty: 10 },
    } as any as ActivatedRouteSnapshot;
    guard.canActivate(routes).subscribe((allowed) => {
      expect(allowed).toBe(false);
      expect(navigateSpy).toHaveBeenCalled();
      done();
    });
    userService.user$.next(fakeUser);
    levelService.levels$.next(fakeLevels);
  });
});
