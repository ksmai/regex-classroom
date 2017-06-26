import * as express from 'express';
import * as supertest from 'supertest';

import { testUser } from '../test-utils';
import { User } from './user.model';
import { userRouter } from './user.router';

describe('userRouter', () => {
  let request: any;
  let setProgressSpy: jasmine.Spy;
  let getProgressSpy: jasmine.Spy;
  let user: any;
  let progress: number[];

  beforeEach(() => {
    user = testUser('password');
    progress = [1, 2, 3];
    setProgressSpy = spyOn(User as any, 'setProgress')
      .and.returnValue(Promise.resolve(user));
    getProgressSpy = spyOn(User as any, 'getProgress')
      .and.returnValue(Promise.resolve(user));
  });

  describe('authenticated user', () => {
    beforeEach(() => {
      const app = express();
      app.use((req, res, next) => {
        req.user = user;
        next();
      });
      app.use(userRouter);
      request = supertest(app);
    });

    it('should be able to get progress', (done) => {
      request
        .get('/progress')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res: any) => {
          expect(res.body.user).toEqual(user);
          expect(getProgressSpy).toHaveBeenCalled();
        })
        .then(done, done.fail);
    });

    it('should be able to set progress', (done) => {
      request
        .put('/progress')
        .send({ progress })
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res: any) => {
          expect(res.body.user).toEqual(user);
          expect(setProgressSpy).toHaveBeenCalledWith(user._id, progress);
        })
        .then(done, done.fail);
    });
  });

  describe('guest user', () => {
    beforeEach(() => {
      const app = express();
      app.use(userRouter);
      request = supertest(app);
    });

    it('should not be able to get progress', (done) => {
      request
        .get('/progress')
        .expect(401)
        .expect('Content-Type', /json/)
        .then((res: any) => {
          expect(res.body.error).toBeDefined();
          expect(getProgressSpy).not.toHaveBeenCalled();
        })
        .then(done, done.fail);
    });

    it('should be able to set progress', (done) => {
      request
        .put('/progress')
        .send({ progress })
        .expect(401)
        .expect('Content-Type', /json/)
        .then((res: any) => {
          expect(res.body.error).toBeDefined();
          expect(setProgressSpy).not.toHaveBeenCalled();
        })
        .then(done, done.fail);
    });
  });
});
