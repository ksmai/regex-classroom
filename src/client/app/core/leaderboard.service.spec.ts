import { ReflectiveInjector } from '@angular/core';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  RequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LeaderboardService } from './leaderboard.service';
import { IUser } from './user.service';

const fakeUsers: IUser[] = [
  {
    id: '123',
    name: 'foo',
    progress: [1],
    level: 0.1,
    badges: [],
    totalBadges: 0,
  },
  {
    id: '456',
    name: 'bar',
    progress: [3, 6, 9],
    level: 1.8,
    badges: [2, 2, 1],
    totalBadges: 3,
  },
];

describe('LeaderboardService', () => {
  let injector: ReflectiveInjector;
  let leaderboardService: LeaderboardService;
  let backend: MockBackend;
  let conn: any;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: RequestOptions, useClass: BaseRequestOptions },
      { provide: ConnectionBackend, useClass: MockBackend },
      Http,
      LeaderboardService,
    ]);
    leaderboardService = injector.get(LeaderboardService);
    backend = injector.get(ConnectionBackend) as MockBackend;
    backend.connections.subscribe((lastConn: any) => conn = lastConn);
  });

  it('should send an api request to the server', (done) => {
    leaderboardService.listUsers().subscribe((users: IUser[]) => {
      expect(users).toEqual(fakeUsers);
      done();
    });

    expect(conn).toBeTruthy();
    conn.mockRespond(new Response(new ResponseOptions({
      body: { users: fakeUsers },
    })));
  });
});
