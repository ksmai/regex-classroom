import * as passport from 'passport';
import { Strategy } from 'passport-local';

import { User } from '../user/user.model';

passport.use(new Strategy(
  (username, password, done) => {
    (User as any)
      .login(username, password)
      .then((user: any) => done(null, user))
      .catch((err: any) => done(err));
  },
));

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser((id, done) => {
  User
    .findById(id)
    .select({ hash: 0 })
    .exec()
    .then((user: any) => done(null, user))
    .catch((err: any) => done(err));
});
