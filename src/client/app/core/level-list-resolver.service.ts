import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ILevel, LevelService } from './level.service';

/**
 * Resolves level data. See {@link LevelService} for details
 */
@Injectable()
export class LevelListResolver implements Resolve<ILevel[]> {
  constructor(private levelService: LevelService) {
  }

  resolve(): Observable<ILevel[]> {
    return this.levelService.getLevels();
  }
}
