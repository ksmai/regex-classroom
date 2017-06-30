import * as mongoose from 'mongoose';

import { testUser } from '../test-utils';
import { User } from './user.model';

describe('User model', () => {
  let user: any;
  const password = 'password';

  beforeAll((done) => {
    const MONGO_URL = process.env.MONGO_URL ||
      'mongodb://localhost:27017/user-test';
    mongoose
      .connect(MONGO_URL)
      .then(done, done.fail);
  });

  beforeEach((done) => {
    User
      .remove({})
      .then(done, done.fail);
  });

  beforeEach((done) => {
    user = testUser(password);
    User
      .create(user)
      .then(done, done.fail);
  });

  afterAll((done) => {
    mongoose
      .disconnect()
      .then(done, done.fail);
  });

  describe('validation', () => {
    it('should let a valid user pass', (done) => {
      new User(user).validate().then(done, done.fail);
    });

    it('should invalidate a short name', (done) => {
      user.name = 'a';
      new User(user).validate().then(() => done.fail(), done);
    });

    it('should invalidate a long name', (done) => {
      user.name = 'abcdefghijklmnopqrstuvwxyz';
      new User(user).validate().then(() => done.fail(), done);
    });

    it('should invalidate a name with special characters', (done) => {
      user.name = 'hello!';
      new User(user).validate().then(() => done.fail(), done);
    });
  });

  describe('signup', () => {
    it('should create a new user', (done) => {
      const name = user.name + '2';
      (User as any)
        .signup(name, password)
        .then(() => User.findOne({ name }).exec())
        .then((foundUser: any) => foundUser ? done() : done.fail());
    });

    it('should not allow signing up with an existing name', (done) => {
      (User as any)
        .signup(user.name, password)
        .then(() => done.fail(), done);
    });

    it('should not allow a short password', (done) => {
      (User as any)
        .signup(user.name + '123', '123')
        .then(() => done.fail(), done);
    });

    it('should not allow a long password', (done) => {
      (User as any)
        .signup(user.name + '123', '123'.repeat(20))
        .then(() => done.fail(), done);
    });
  });

  describe('login', () => {
    it('should log user with the correct password in', (done) => {
      (User as any)
        .login(user.name, password)
        .then((loginedUser: any) => loginedUser ? done() : done.fail());
    });

    it('should throw if username does not exist', (done) => {
      (User as any)
        .login(user.name + '2', password)
        .then(() => done.fail(), done);
    });

    it('should throw if password does not match', (done) => {
      (User as any)
        .login(user.name, password + '1')
        .then(() => done.fail(), done);
    });
  });

  describe('progress', () => {
    it('should get progress of user', (done) => {
      (User as any)
        .getProgress(user._id)
        .then((returnedUser: any) => {
          expect(returnedUser.progress).toEqual(user.progress);
          expect(returnedUser.badges).toEqual(user.badges);
        })
        .then(done, done.fail);
    });

    it('should not return the hash of user', (done) => {
      (User as any)
        .getProgress(user._id)
        .then((returnedUser: any) => {
          expect(returnedUser.hash).toBeFalsy();
        })
        .then(done, done.fail);
    });

    it('should throw if getting progress of non-existent user', (done) => {
      (User as any)
        .getProgress(user._id.replace(/./g, 'x'))
        .then(() => done.fail(), done);
    });

    it('should set progress of a user', (done) => {
      const progress = [4, 2, 4, 2];
      const badges = [6, 6, 7];
      (User as any)
        .setProgress(user._id, progress, badges)
        .then((updatedUser: any) => {
          expect(updatedUser.progress).toEqual(progress);
          expect(updatedUser.badges).toEqual(badges);
        })
        .then(done, done.fail);
    });

    it('should throw if setting progress of non-existent user', (done) => {
      (User as any)
        .setProgress(user._id.replace(/./g, 'x'), [1, 2, 3])
        .then(() => done.fail(), done);
    });

    it('should show level of a user', (done) => {
      (User as any)
        .getProgress(user._id)
        .then((returnedUser: any) => {
          expect(returnedUser.level).toBeDefined();
        })
        .then(done, done.fail);
    });
  });
});
