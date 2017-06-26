import * as mongoose from 'mongoose';

import { testLevel } from '../test-utils';
import { Level } from './level.model';

(mongoose as any).Promise = global.Promise;

describe('Level', () => {
  let level: any;
  let count = 0;

  beforeAll((done) => {
    const MONGO_URL = process.env.MONGO_URL ||
      'mongodb://localhost:27017/level-test';
    mongoose
      .connect(MONGO_URL)
      .then(done, done.fail);
  });

  beforeEach((done) => {
    count = 0;
    Level
      .remove({})
      .then(done, done.fail);
  });

  beforeEach((done) => {
    level = testLevel(count);
    count += 1;
    Level
      .create(level)
      .then(done, done.fail);
  });

  afterAll((done) => {
    mongoose
      .disconnect()
      .then(done, done.fail);
  });

  describe('Validation', () => {
    it('should validate a new level', (done) => {
      Level
        .create(testLevel(count))
        .then(done, done.fail);
      count += 1;
    });

    it('should not allow inserting the same difficulty twice', (done) => {
      Level
        .create(testLevel(level.difficulty))
        .then(() => done.fail(), done);
    });

    it('should not allow negative difficulty', (done) => {
      Level
        .create(testLevel(-1))
        .then(() => done.fail(), done);
    });

    it('should round difficulty to closest integer', (done) => {
      Level
        .create(testLevel(42.42))
        .then((newLevel: any) => {
          expect(newLevel.difficulty).toEqual(42);
        })
        .then(done, done.fail);
    });
  });

  describe('countAll', () => {
    it('should count total number of levels', (done) => {
      (Level as any)
        .countAll()
        .then((total: number) => {
          expect(total).toEqual(count);
          return Level.create(testLevel(count++));
        })
        .then(() => (Level as any).countAll())
        .then((total: number) => {
          expect(total).toEqual(count);
        })
        .then(done, done.fail);
    });
  });

  describe('get', () => {
    it('should get a level given the difficulty', (done) => {
      (Level as any)
        .get(level.difficulty)
        .then((requestedLevel: any) => {
          expect(requestedLevel.difficulty).toEqual(level.difficulty);
          expect(requestedLevel.tests.length).toEqual(level.tests.length);
        })
        .then(done, done.fail);
    });

    it('should throw if level does not exist', (done) => {
      (Level as any)
        .get(count)
        .then(() => done.fail(), done);
    });
  });
});
