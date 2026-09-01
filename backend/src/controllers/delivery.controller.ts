import { NextFunction, Request, Response } from 'express';
import { findRoute } from '../domains/delivery';
import { sendSuccess } from '../utils/response';

const getRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const route = await findRoute(req.user!.role);
    sendSuccess(res, route);
  } catch (err) {
    next(err);
  }
};

export default { getRoute };
