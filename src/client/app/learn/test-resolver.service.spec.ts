import { ReflectiveInjector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { FakeLevelService } from '../../test_utils';
import { ILevel, LevelService } from '../core/level.service';
import { TestResolver } from './test-resolver.service';

describe('TestResolver', () => {
  let injector: ReflectiveInjector;
  let resolver: TestResolver;
  let levelService: FakeLevelService;
  let fakeLevels: ILevel[];

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: LevelService, useClass: FakeLevelService },
      TestResolver,
    ]);
    levelService = injector.get(LevelService);
    resolver = injector.get(TestResolver);
    fakeLevels = [
      {
        difficulty: 0,
        id: '0',
        name: 'Zero',
        tests: [
          { question: 'q0', answer: 'a0' },
        ],
      },
      {
        difficulty: 1,
        id: '1',
        name: 'One',
        tests: [
          { question: 'q1a', answer: 'a1a' },
          { question: 'q1b', answer: 'a1b' },
        ],
      },
      {
        difficulty: 2,
        id: '2',
        name: 'Two',
        tests: [
          { question: 'q2a', answer: 'a2a' },
          { question: 'q2b', answer: 'a2b' },
          { question: 'q2c', answer: 'a2c' },
        ],
      },
    ];
    levelService.levels$.next(fakeLevels);
  });

  it('should aggregate tests from previous levels', (done) => {
    const routes = {
      params: {
        difficulty: 2,
      },
    } as any as ActivatedRouteSnapshot;
    resolver.resolve(routes).subscribe((level: ILevel) => {
      expect(level.name).toEqual(fakeLevels[2].name);
      const expectedTests = fakeLevels[0].tests
        .concat(fakeLevels[1].tests)
        .concat(fakeLevels[2].tests);
      expect(level.tests).toEqual(expectedTests);
      done();
    });
  });
});
