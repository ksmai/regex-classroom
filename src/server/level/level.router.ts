import * as express from 'express';

import { Level } from './level.model';

export const levelRouter = express.Router();

levelRouter.get('/levels', (req, res, next) => {
  (Level as any)
    .getAll()
    .then((levels: any[]) => res.json({ levels }))
    .catch((err: any) => {
      err.status = 400;
      next(err);
    });
});

levelRouter.get('/level/:difficulty', (req, res, next) => {
  (Level as any)
    .get(Number(req.params.difficulty))
    .then((level: any) => res.json({ level }))
    .catch((err: any) => {
      err.status = 400;
      next(err);
    });
});

levelRouter.use((err: any, req: any, res: any, next: any) => {
  const status = err.status || 400;
  const message = err.message || err.toString();
  res.status(status).json({ error: message });
});
