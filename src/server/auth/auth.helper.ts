import { NextFunction, Request, Response } from 'express';

export function ensureLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    const err = new Error('Only for logged-in users');
    Object.assign(err, { status: 401 });
    next(err);
    return;
  }

  next();
}

export function ensureNotLogin(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    const err = new Error('Not for logged-in users');
    Object.assign(err, { status: 401 });
    next(err);
    return;
  }

  next();
}
