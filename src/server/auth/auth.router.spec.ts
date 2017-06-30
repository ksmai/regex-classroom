import * as express from 'express';
import * as passport from 'passport';
import * as supertest from 'supertest';

import { testUser } from '../test-utils';
import { User } from '../user/user.model';
import { authRouter } from './auth.router';

describe('authRouter', () => {
  let request: any;
  let loginSpy: jasmine.Spy;
  let signupSpy: jasmine.Spy;
  let findSpy: jasmine.Spy;
  let user: any;
  const username = 'username';
  const password = 'password';
  const progress = [3];
  const badges = [6, 7];

  describe('Guest', () => {
    beforeEach(() => {
      const app = express();
      app.use(passport.initialize());
      app.use(authRouter);
      request = supertest(app);
      user = testUser('password');
      loginSpy = spyOn(User as any, 'login')
        .and.returnValue(Promise.resolve(user));
      signupSpy = spyOn(User as any, 'signup')
        .and.returnValue(Promise.resolve(user));
      findSpy = spyOn(User, 'findOne')
        .and.returnValue({ exec: () => Promise.resolve(null) });
    });

    it('should be able to login', (done) => {
      request
        .post('/login')
        .send({ username, password })
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res: any) => {
          expect(loginSpy).toHaveBeenCalledWith(username, password);
          expect(res.body.user._id).toEqual(user._id);
        })
        .then(done, done.fail);
    });

    it('should be able to signup', (done) => {
      request
        .post('/signup')
        .send({ username, password, progress, badges })
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res: any) => {
          expect(signupSpy)
            .toHaveBeenCalledWith(username, password, progress, badges);
          expect(res.body.user._id).toEqual(user._id);
        })
        .then(done, done.fail);
    });

    it('should not be able to logout', (done) => {
      request
        .get('/logout')
        .expect(401)
        .then(done, done.fail);
    });

    it('should not be able to check identity', (done) => {
      request
        .get('/me')
        .expect(401)
        .then(done, done.fail);
    });

    it('should be able to check availablility of names', (done) => {
      request
        .get(`/name/${user.name}`)
        .expect(200)
        .then(done, done.fail);
    });
  });

  describe('Authenticated user', () => {
    beforeEach(() => {
      user = testUser('password');
      const app = express();
      app.use(passport.initialize());
      // fake a user in session
      app.use((req, res, next) => {
        req.user = user;
        next();
      });
      app.use(authRouter);
      request = supertest(app);
      loginSpy = spyOn(User as any, 'login')
        .and.returnValue(Promise.resolve(user));
      signupSpy = spyOn(User as any, 'signup')
        .and.returnValue(Promise.resolve(user));
    });

    it('should not be able to login again', (done) => {
      request
        .post('/login')
        .send({ username, password })
        .expect(401)
        .then(() => {
          expect(loginSpy).not.toHaveBeenCalled();
        })
        .then(done, done.fail);
    });

    it('should not be able to signup again', (done) => {
      request
        .post('/signup')
        .send({ username, password })
        .expect(401)
        .then(() => {
          expect(signupSpy).not.toHaveBeenCalled();
        })
        .then(done, done.fail);
    });

    it('should be able to logout', (done) => {
      request
        .get('/logout')
        .expect(200)
        .then(done, done.fail);
    });

    it('should be able to get identity', (done) => {
      request
        .get('/me')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res: any) => {
          expect(res.body.user).toEqual(user);
        })
        .then(done, done.fail);
    });
  });
});
