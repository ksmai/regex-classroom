import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ILevel, LevelService } from '../core/level.service';

/**
 * Resolve the test data by aggregating tests from the previous levels
 * up to and including the current level
 */
@Injectable()
export class TestResolver implements Resolve<ILevel> {
  constructor(private levelService: LevelService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<ILevel> {
    return this.levelService
      .getLevels()
      .map((levels: ILevel[]) => {
        const difficulty = Math.round(Number(route.params.difficulty));
        const relatedLevels = levels.slice(0, difficulty + 1);
        return relatedLevels
          .reduce((combinedLevel: ILevel, level: ILevel) => ({
            name: level.name,
            difficulty: level.difficulty,
            tests: combinedLevel.tests.concat(level.tests),
          } as ILevel));
      });
  }
}
