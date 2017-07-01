import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class FakeLevelService {
  levels$ = new ReplaySubject<any>(1);

  getLevels(): Observable<any> {
    return this.levels$.asObservable();
  }
}
