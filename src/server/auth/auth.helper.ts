export function ensureLogin(req: any, res: any, next: any) {
  if (!req.user) {
    const err = new Error('Only for logged-in users');
    Object.assign(err, { status: 401 });
    next(err);
    return;
  }

  next();
}

export function ensureNotLogin(req: any, res: any, next: any) {
  if (req.user) {
    const err = new Error('Not for logged-in users');
    Object.assign(err, { status: 401 });
    next(err);
    return;
  }

  next();
}
