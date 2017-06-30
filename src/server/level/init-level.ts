/* tslint:disable:no-console max-line-length */
/**
 * This file should be run at least once in any database used by this
 * app for initializing the data for all levels
 */
import * as mongoose from 'mongoose';

import { Level } from './level.model';
import { levels } from './levels';

(mongoose as any).Promise = global.Promise;
const MONGO_URL = process.env.MONGO_URL ||
  'mongodb://localhost:27017/regex-classroom';
mongoose
  .connect(MONGO_URL)
  .then(() => Level.remove({}))
  .then(() => {
    const promises = levels
      .map((level, i) => Object.assign({}, level, { difficulty: i }))
      .map((level) => Level.create(level));

    return Promise.all(promises);
  })
  .then(() => mongoose.disconnect())
  .then(() => {
    console.log('Successfully initialized level data in');
    console.log(MONGO_URL);
  })
  .catch((err: any) => {
    console.error('Failed to initialize level data in');
    console.error(MONGO_URL);
    console.error(err.message || err);
    console.error('Your database may not contain the data necessary to run the application properly. To fix this problem, make sure the environment variable "MONGO_URL" is set up correctly and then run "yarn run init"');
  });
