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

  progress: {
    type: [Number],
    default: [],
    get: (arr) => arr,
    set: (arr) => arr.map((points: number) => Math.round(points)),
  },
});

userSchema.set('toJSON', { virtuals: true, getters: true });
userSchema.set('toObject', { virtuals: true, getters: true });

userSchema.virtual('level').get(function() {
  const sum = this.progress
    .reduce((total: number, current: number) => total + current, 0);
  return sum / 10;
});

userSchema.statics.signup = function(name: string, password: string) {
  if (password.length < 8) {
    return Promise.reject(new Error('Password is too short'));
  } else if (password.length > 30) {
    return Promise.reject(new Error('Password is too long'));
  }

  return bcrypt
    .hash(password, 8)
    .then((hash) => this.create({ name, hash }))
    .then(helpers.toObject);
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
) {
  const updates = { progress };
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

export const User = mongoose.model('User', userSchema, 'users');
