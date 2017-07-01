import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { retry } from './http.helper';

export interface ITest {
  question: string;
  answer: string;
}

export interface ILevel {
  id: string;
  name: string;
  difficulty: number;
  tests: ITest[];
}

/**
 * Utilities for fetching data about a list of levels or a particular
 * level
 */
@Injectable()
export class LevelService {
  private levels: ILevel[];
  private pendingRequest: Observable<ILevel[]>;

  constructor(private http: Http) {
  }

  getLevels(): Observable<ILevel[]> {
    if (this.levels) {
      return Observable.of(this.levels);
    } else if (this.pendingRequest) {
      return this.pendingRequest;
    } else {
      return this.fetchLevels();
    }
  }

  getLevel(difficulty: number, retried = false): Observable<ILevel> {
    if (this.levels) {
      const level = this.levels
        .find((l: ILevel) => l.difficulty === difficulty);
      return Observable.of(level);
    } else if (retried) {
      return Observable.of(null);
    }

    const src = this.pendingRequest || this.fetchLevels();
    return src.switchMap(() => this.getLevel(difficulty, true));
  }

  private fetchLevels(): Observable<ILevel[]> {
    if (!this.pendingRequest) {
      this.pendingRequest = this
        .http
        .get('/api/v1/levels')
        .map((res: Response) => res.json().levels as ILevel[])
        .let(retry(3, 400))
        .catch((err: Error|any) => Observable.of(null))
        .do(() => this.pendingRequest = null)
        .do((levels: ILevel[]) => this.levels = levels);
    }

    return this.pendingRequest;
  }
}
