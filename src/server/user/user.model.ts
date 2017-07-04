/* tslint:disable:no-bitwise */
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

import * as helpers from './user.helper';

(mongoose as any).Promise = global.Promise;

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    match: /^[A-Za-z0-9_\-\. ]+$/,
    index: true,
    unique: true,
    require: true,
    trim: true,
  },

  hash: {
    type: String,
    required: true,
  },

  // each number represents the highscore in the corresponding level
  progress: {
    type: [Number],
    default: [],
    get: (arr) => arr,
    set: (arr) => arr.map((points: number) => Math.round(points)),
  },

  // the sum of all highscores in the progress array divided by 10
  level: {
    type: Number,
    default: 0,
    min: 0,
  },

  // each number represents a collection of badges in the corresponding
  // level, where the n-th least significant bit represents the n-th
  // badge
  badges: {
    type: [Number],
    default: [],
    get: (arr) => arr,
    set: (arr) => arr.map((points: number) => (points | 0)),
  },

  totalBadges: {
    type: Number,
    default: 0,
    get: (n) => Math.round(n),
    set: (n) => Math.round(n),
  },
});

userSchema.set('toJSON', { virtuals: true, getters: true });
userSchema.set('toObject', { virtuals: true, getters: true });

userSchema.statics.signup = function(
  name: string,
  password: string,
  progress: number[] = [],
  badges: number[] = [],
) {
  if (password.length < 8) {
    return Promise.reject(new Error('Password is too short'));
  } else if (password.length > 30) {
    return Promise.reject(new Error('Password is too long'));
  }

  return this
    .findOne({ name })
    .exec()
    .then((user: any) => {
      if (user) {
        throw new Error(`Username already exists: ${name}`);
      }

      return bcrypt.hash(password, 8);
    })
    .then((hash: string) => this.create({ name, hash }))
    .then((user: any) => this.setProgress(user._id, progress, badges));
};

userSchema.statics.login = function(name: string, password: string) {
  return this
    .findOne({ name })
    .exec()
    .then(helpers.assertUser('Password does not match'))
    .then((user: any) => {
      return bcrypt
        .compare(password, user.hash)
        .then((match) => {
          if (match) {
            return user;
          } else {
            throw new Error('Password does not match');
          }
        });
    })
    .then(helpers.toObject);
};

userSchema.statics.getProgress = function(userID: string) {
  return this
    .findById(userID)
    .exec()
    .then(helpers.assertUser('User not found'))
    .then(helpers.toObject);
};

userSchema.statics.setProgress = function(
  userID: string,
  progress: number[],
  badges: number[],
) {
  const level = progress.reduce((sum, cur) => sum + cur, 0) / 10;
  const totalBadges = badges
    .reduce((sum, cur) => sum + helpers.totalBits(cur), 0);
  const updates = { progress, badges, level, totalBadges };
  const options = {
    new: true,
    upsert: false,
    runValidators: true,
  };

  return this
    .findByIdAndUpdate(userID, updates, options)
    .then(helpers.assertUser('User not found'))
    .then(helpers.toObject);
};

userSchema.statics.listUsers = function(skip = 0, limit = 50) {
  return this
    .find({})
    .select({ hash: 0 })
    .sort({ level: -1, totalBadges: -1, name: 1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

export const User = mongoose.model('User', userSchema, 'users');
