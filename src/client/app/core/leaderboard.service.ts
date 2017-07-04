import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { retry } from './http.helper';
import { IUser } from './user.service';

@Injectable()
export class LeaderboardService {
  constructor(private http: Http) {
  }

  listUsers(skip = 0, limit = 50): Observable<IUser[]> {
    return this.http
      .get(`/api/v1/leaderboard?skip=${skip}&limit=${limit}`)
      .let(retry(3, 400))
      .map((res: Response) => res.json().users as IUser[])
      .catch(() => Observable.of([]));
  }
}
