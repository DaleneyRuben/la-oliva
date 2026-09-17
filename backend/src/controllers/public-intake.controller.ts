import { NextFunction, Request, Response } from 'express';
import { submitPublicIntake } from '../domains/client';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await submitPublicIntake(req.body);
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { create };
