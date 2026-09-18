import { NextFunction, Request, Response } from 'express';

import { captureLoginRateLimitExceeded } from '../../utils/sentry';
import { createLoginRateLimitMiddleware } from '../login-rate-limit';

jest.mock('../../utils/sentry', () => ({
  captureLoginRateLimitExceeded: jest.fn(),
}));

const mockCaptureLoginRateLimitExceeded = captureLoginRateLimitExceeded as jest.Mock;

const makeRequest = ({
  username = 'ada',
  forwardedIp,
  ip = '127.0.0.1',
}: {
  username?: string;
  forwardedIp?: string;
  ip?: string;
} = {}): Request =>
  ({
    body: { username },
    ip,
    get: jest.fn((header: string) =>
      header.toLowerCase() === 'x-vercel-forwarded-for' ? forwardedIp : undefined,
    ),
  }) as unknown as Request;

const makeResponse = (): Response => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response);
  response.set = jest.fn().mockReturnValue(response);
  response.json = jest.fn().mockReturnValue(response);
  return response;
};

describe('login rate limit middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('continues when both limits allow the request', async () => {
    const check = jest.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    const middleware = createLoginRateLimitMiddleware(check);
    const request = makeRequest({ forwardedIp: '203.0.113.7' });
    const response = makeResponse();
    const next = jest.fn() as NextFunction;

    await middleware(request, response, next);

    expect(check).toHaveBeenCalledWith({ username: 'ada', ip: '203.0.113.7' });
    expect(next).toHaveBeenCalledWith();
    expect(response.status).not.toHaveBeenCalled();
  });

  it('uses the Express request IP outside Vercel', async () => {
    const check = jest.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 });
    const middleware = createLoginRateLimitMiddleware(check);
    const request = makeRequest({ ip: '127.0.0.2' });
    const response = makeResponse();
    const next = jest.fn() as NextFunction;

    await middleware(request, response, next);

    expect(check).toHaveBeenCalledWith({ username: 'ada', ip: '127.0.0.2' });
  });

  it('returns a generic 429 response with Retry-After when blocked', async () => {
    const check = jest.fn().mockResolvedValue({ allowed: false, retryAfterSeconds: 90 });
    const middleware = createLoginRateLimitMiddleware(check);
    const request = makeRequest();
    const response = makeResponse();
    const next = jest.fn() as NextFunction;

    await middleware(request, response, next);

    expect(response.set).toHaveBeenCalledWith('Retry-After', '90');
    expect(response.status).toHaveBeenCalledWith(429);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Demasiados intentos. Intenta nuevamente más tarde.',
    });
    expect(mockCaptureLoginRateLimitExceeded).toHaveBeenCalledWith(90);
    expect(next).not.toHaveBeenCalled();
  });

  it('fails closed when the shared limiter is unavailable', async () => {
    const check = jest.fn().mockRejectedValue(new Error('redis unavailable'));
    const middleware = createLoginRateLimitMiddleware(check);
    const request = makeRequest();
    const response = makeResponse();
    const next = jest.fn() as NextFunction;

    await middleware(request, response, next);

    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Inicio de sesión temporalmente no disponible.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
