import { NextFunction, Request, Response } from 'express';
import { findAll as findAllMenus, findByDate as findMenuByDate, upsertWeek } from '../domains/menu';
import { sendError, sendSuccess } from '../utils/response';

const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await findAllMenus();
    sendSuccess(res, menus);
  } catch (err) {
    next(err);
  }
};

const getByDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu = await findMenuByDate(req.params.date);
    if (!menu) {
      sendError(res, 'Menu not found', 404);
      return;
    }
    sendSuccess(res, menu);
  } catch (err) {
    next(err);
  }
};

const saveWeek = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await upsertWeek(req.body.menus);
    sendSuccess(res, menus);
  } catch (err) {
    next(err);
  }
};

export default { getAll, getByDate, saveWeek };
