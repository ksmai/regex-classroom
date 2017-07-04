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

    it('should save user with existing progress/badges, if any', (done) => {
      const name = user.name + '2';
      const progress = [1, 3, 5, 7, 9];
      const badges = [2, 3, 5, 7];
      (User as any)
        .signup(name, password, progress, badges)
        .then((newUser: any) => {
          expect(newUser.badges).toEqual(badges);
          expect(newUser.progress).toEqual(progress);
        })
        .then(done, done.fail);
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
        .setProgress(user._id.replace(/./g, 'x'), [1, 2, 3], [])
        .then(() => done.fail(), done);
    });

    it('should compute level from the progress array', (done) => {
      const progress = [1, 3, 5, 7, 9];
      const level = progress.reduce((sum, cur) => sum + cur, 0) / 10;
      (User as any)
        .setProgress(user._id, progress, [])
        .then((returnedUser: any) => {
          expect(returnedUser.level).toEqual(level);
        })
        .then(done, done.fail);
    });

    it('should compute totalBadges from the badges array', (done) => {
      const badges = [3, 7, 2, 5, 0];
      const totalBadges = 8;
      (User as any)
        .setProgress(user._id, [], badges)
        .then((returnedUser: any) => {
          expect(returnedUser.totalBadges).toEqual(totalBadges);
        })
        .then(done, done.fail);
    });
  });

  describe('listUsers', () => {
    it('should sort users by levels and then totalBadges', (done) => {
      const midLevel = user.level;
      const highLevel = midLevel + 1;
      const lowLevel = midLevel - 1;
      const moreBadges = user.totalBadges + 2;
      const lessBadges = user.totalBadges + 1;
      User
        .create([
          {
            name: 'list1',
            hash: 'hash',
            level: highLevel,
            totalBadges: moreBadges,
          },
          {
            name: 'list2',
            hash: 'hash',
            level: highLevel,
            totalBadges: lessBadges,
          },
          {
            name: 'list3',
            hash: 'hash',
            level: midLevel,
            totalBadges: moreBadges,
          },
          {
            name: 'list4',
            hash: 'hash',
            level: midLevel,
            totalBadges: lessBadges,
          },
          {
            name: 'list5',
            hash: 'hash',
            level: lowLevel,
            totalBadges: moreBadges,
          },
          {
            name: 'list6',
            hash: 'hash',
            level: lowLevel,
            totalBadges: lessBadges,
          },
        ])
        .then(() => (User as any).listUsers())
        .then((users: any[]) => {
          for (let i = 1; i < users.length; i++) {
            expect(users[i].level).not.toBeGreaterThan(users[i - 1].level);
            if (users[i].level === users[i - 1].level) {
              expect(users[i].totalBadges)
                .not.toBeGreaterThan(users[i - 1].totalBadges);
            }
          }
        })
        .then(done, done.fail);
    });
  });
});
