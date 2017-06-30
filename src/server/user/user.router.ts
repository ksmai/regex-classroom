/**
 * Set up user-related routes including getter and setter for progress
 */
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { ensureLogin } from '../auth/auth.helper';
import { User } from './user.model';

export const userRouter = express.Router();

userRouter
  .route('/progress')
  .get(
    ensureLogin,
    (req, res, next) => {
      (User as any)
        .getProgress(req.user._id)
        .then((user: any) => res.json({ user }))
        .catch((err: any) => {
          err.status = 400;
          next(err);
        });
    },
  )
  .put(
    ensureLogin,
    bodyParser.json(),
    (req, res, next) => {
      if (!req.body.progress) {
        const err = new Error('No progress specified');
        Object.assign(err, { status: 400 });
        next(err);
        return;
      }
      if (!req.body.badges) {
        const err = new Error('No badges specified');
        Object.assign(err, { status: 400 });
        next(err);
        return;
      }
      (User as any)
        .setProgress(req.user._id, req.body.progress, req.body.badges)
        .then((user: any) => res.json({ user }))
        .catch((err: any) => {
          err.status = 400;
          next(err);
        });
    },
  );

userRouter.use((
  err: Error|any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const status = err.status || 400;
  const message = err.message || err.toString();
  res.status(status).json({ error: message });
});
