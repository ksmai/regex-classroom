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
import 'rxjs/add/operator/skip';

import { IUser, UserService } from './user.service';

describe('UserService', () => {
  let injector: ReflectiveInjector;
  let userService: UserService;
  let lastConnection: any;
  let backend: MockBackend;
  let fakeUser: IUser;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      { provide: RequestOptions, useClass: BaseRequestOptions },
      { provide: ConnectionBackend, useClass: MockBackend },
      Http,
      UserService,
    ]);
    userService = injector.get(UserService);
    lastConnection = null;
    backend = injector.get(ConnectionBackend);
    backend.connections.subscribe((conn: any) => lastConnection = conn);
    fakeUser = {
      id: '123',
      name: 'foobarbaz',
      level: 0.9,
      progress: [3, 6],
      badges: [2, 3, 1, 0],
    };
  });

  afterEach(() => {
    backend.verifyNoPendingRequests();
  });

  it('should fetch current user', (done) => {
    userService.fetchUser().skip(1).subscribe((user) => {
      expect(user).toEqual(fakeUser);
      done();
    });
    expect(lastConnection).toBeDefined();
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { user: fakeUser },
    })));
  });

  it('should get current user without http requests', (done) => {
    userService.getUser().subscribe((user) => {
      expect(user).toBe(null);
      expect(lastConnection).toBeFalsy();
      done();
    });
  });

  it('should log user in and update current user', (done) => {
    const username = 'qwer';
    const password = '1234';
    userService.login(username, password).subscribe((success) => {
      expect(success).toEqual(true);
      lastConnection = null;
      userService.getUser().subscribe((user) => {
        expect(user).toEqual(fakeUser);
        expect(lastConnection).toBe(null);
        done();
      });
    });

    expect(lastConnection).toBeDefined();
    const body = JSON.parse(lastConnection.request.getBody());
    expect(body.username).toEqual(username);
    expect(body.password).toEqual(password);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { user: fakeUser },
    })));
  });

  it('should sign user up and update current user', (done) => {
    const username = 'qwer';
    const password = '1234';
    userService.signup(username, password).subscribe((success) => {
      expect(success).toEqual(true);
      lastConnection = null;
      userService.getUser().subscribe((user) => {
        expect(user).toEqual(fakeUser);
        expect(lastConnection).toBe(null);
        done();
      });
    });

    expect(lastConnection).toBeDefined();
    const body = JSON.parse(lastConnection.request.getBody());
    expect(body.username).toEqual(username);
    expect(body.password).toEqual(password);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { user: fakeUser },
    })));
  });

  it('should log user out and clear all data', (done) => {
    userService.logout().subscribe((success) => {
      expect(success).toEqual(true);
      lastConnection = null;
      userService.getUser().subscribe((user) => {
        expect(user).toEqual(null);
        expect(lastConnection).toBe(null);
        done();
      });
    });

    expect(lastConnection).toBeDefined();
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: {},
    })));
  });

  it('should update progress after user passes an exam', (done) => {
    userService.passExam(0, 5);
    expect(lastConnection).toBeTruthy();
    const newUser = Object.assign({}, fakeUser);
    newUser.progress = fakeUser.progress.slice();
    newUser.progress[0] = 5;
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { user: newUser },
    })));
    userService.getUser().subscribe((user) => {
      expect(user).toEqual(newUser);
      done();
    });
  });

  it('should not update progress if user pass with a lower score than before', (done) => {
    userService.fetchUser().skip(1).subscribe((user) => {
      expect(user).toEqual(fakeUser);
      lastConnection = null;
      userService.passExam(1, 2);
      expect(lastConnection).toBeFalsy();
      userService.getUser().subscribe((user2) => {
        expect(user2).toEqual(fakeUser);
        done();
      });
    });

    expect(lastConnection).toBeDefined();
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { user: fakeUser },
    })));
  });

  it('should update badges after user win competition', (done) => {
    userService.winCompetition(0, 0);
    expect(lastConnection).toBeTruthy();
    const newUser = Object.assign({}, fakeUser);
    newUser.badges = fakeUser.badges.slice();
    newUser.badges[0] = 3;
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { user: newUser },
    })));
    userService.getUser().subscribe((user) => {
      expect(user).toEqual(newUser);
      done();
    });
  });

  it('should not update badges if user has won before', (done) => {
    userService.fetchUser().skip(1).subscribe((user) => {
      expect(user).toEqual(fakeUser);
      lastConnection = null;
      userService.winCompetition(0, 1);
      expect(lastConnection).toBeFalsy();
      userService.getUser().subscribe((user2) => {
        expect(user2).toEqual(fakeUser);
        done();
      });
    });

    expect(lastConnection).toBeDefined();
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: { user: fakeUser },
    })));
  });

  it('should check for username availability', (done) => {
    userService.isNameAvailable('abc').subscribe((available) => {
      expect(available).toBe(true);
      done();
    });

    expect(lastConnection).toBeDefined();
    expect(lastConnection.request.url).toMatch(/abc/);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: {},
    })));
  });
});
