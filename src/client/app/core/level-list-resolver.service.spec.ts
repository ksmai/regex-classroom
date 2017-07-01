import { ReflectiveInjector } from '@angular/core';

import { FakeLevelService } from '../../test_utils';
import { LevelListResolver } from './level-list-resolver.service';
import { LevelService } from './level.service';

describe('LevelListResolver', () => {
  let injector: ReflectiveInjector;
  let levelService: FakeLevelService;
  let resolver: LevelListResolver;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: LevelService, useClass: FakeLevelService },
      LevelListResolver,
    ]);
    levelService = injector.get(LevelService);
    resolver = injector.get(LevelListResolver);
  });

  it('should fetch levels', (done) => {
    const levelData = { foo: 'bar' };
    resolver.resolve().subscribe((data: any) => {
      expect(data).toBe(levelData);
      done();
    });
    levelService.levels$.next(levelData);
  });
});
