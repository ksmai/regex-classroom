import * as express from 'express';
import * as supertest from 'supertest';

import { Level } from './level.model';
import { levelRouter } from './level.router';
import { levels } from './levels';

describe('levelRouter', () => {
  let request: any;
  let getAllSpy: jasmine.Spy;
  let getSpy: jasmine.Spy;

  beforeEach(() => {
    const app = express();
    app.use(levelRouter);
    request = supertest(app);
    getAllSpy = spyOn(Level as any, 'getAll')
      .and.returnValue(Promise.resolve(levels));
    getSpy = spyOn(Level as any, 'get')
      .and.returnValue(Promise.resolve(levels[0]));
  });

  it('should get all levels', (done) => {
    request
      .get('/levels')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.levels).toEqual(levels);
        expect(getAllSpy).toHaveBeenCalled();
      })
      .then(done, done.fail);
  });

  it('should get one level', (done) => {
    request
      .get('/level/42')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res: any) => {
        expect(res.body.level).toEqual(levels[0]);
        expect(getSpy).toHaveBeenCalledWith(42);
      })
      .then(done, done.fail);
  });
});
