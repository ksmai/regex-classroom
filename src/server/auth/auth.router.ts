import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as passport from 'passport';

import { User } from '../user/user.model';
import { ensureLogin, ensureNotLogin } from './auth.helper';
import './passport.config';

export const authRouter = express.Router();
const jsonParser = bodyParser.json();
authRouter.post('/login',
  ensureNotLogin,
  jsonParser,
  passport.authenticate('local', { failureRedirect: '/' }),
  (req, res, next) => {
    res.json({ user: req.user });
  },
);

authRouter.post('/signup',
  ensureNotLogin,
  jsonParser,
  (req, res, next) => {
    (User as any)
      .signup(req.body.username, req.body.password)
      .then((user: any) => {
        req.login(user, (err) => {
          if (err) {
            throw err;
          }
          res.json({ user });
        });
      })
      .catch((err: any) => {
        err.status = 401;
        next(err);
      });
  });

authRouter.get('/logout', ensureLogin, (req, res) => {
  req.logout();
  res.json({});
});

authRouter.get('/me', ensureLogin, (req, res) => {
  res.json({ user: req.user });
});

authRouter.use((err: any, req: any, res: any, next: any) => {
  const status = err.status || 401;
  const message = err.message || err.toString();
  res.status(status).json({ error: message });
});
