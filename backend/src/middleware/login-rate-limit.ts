import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

type CheckLoginRateLimit = (input: {
  username: string;
  ip: string;
}) => Promise<{ allowed: boolean; retryAfterSeconds: number }>;

const clientIp = (req: Request): string =>
  req.get('x-vercel-forwarded-for')?.split(',')[0].trim() || req.ip || 'unknown';

export const createLoginRateLimitMiddleware =
  (check: CheckLoginRateLimit) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await check({ username: req.body.username, ip: clientIp(req) });
      if (result.allowed) {
        next();
        return;
      }

      res.set('Retry-After', String(result.retryAfterSeconds));
      res.status(429).json({ error: 'Demasiados intentos. Intenta nuevamente más tarde.' });
    } catch (err) {
      logger.error({ err }, 'login rate limiter unavailable');
      res.status(503).json({ error: 'Inicio de sesión temporalmente no disponible.' });
    }
  };
