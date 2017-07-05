import { ReflectiveInjector } from '@angular/core';

import { FakeLeaderboardService } from '../../test_utils';
import { LeaderboardService } from '../core/leaderboard.service';
import { LeaderboardResolver } from './leaderboard-resolver.service';

describe('LeaderboardResolver', () => {
  let injector: ReflectiveInjector;
  let spy: jasmine.Spy;
  let resolver: LeaderboardResolver;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: LeaderboardService, useClass: FakeLeaderboardService },
      LeaderboardResolver,
    ]);
    spy = spyOn(injector.get(LeaderboardService), 'listUsers');
    resolver = injector.get(LeaderboardResolver);
  });

  it('should resolve the top 50 users', () => {
    resolver.resolve();
    expect(spy).toHaveBeenCalledWith(0, 50);
  });
});
