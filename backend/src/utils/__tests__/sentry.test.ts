import { captureException, captureMessage, flush, init } from '@sentry/node';
import {
  captureError,
  captureLoginRateLimitExceeded,
  initSentry,
  isSentryEnabled,
} from '../sentry';

jest.mock('@sentry/node', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  flush: jest.fn().mockResolvedValue(true),
}));

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe('isSentryEnabled', () => {
  it('is enabled in production with a DSN set', () => {
    process.env.NODE_ENV = 'production';
    process.env.SENTRY_DSN = 'https://key@sentry.example/1';

    expect(isSentryEnabled()).toBe(true);
  });

  it('is disabled in production without a DSN', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.SENTRY_DSN;

    expect(isSentryEnabled()).toBe(false);
  });

  it('is disabled outside production even with a DSN set', () => {
    process.env.NODE_ENV = 'development';
    process.env.SENTRY_DSN = 'https://key@sentry.example/1';

    expect(isSentryEnabled()).toBe(false);
  });
});

describe('initSentry', () => {
  it('initializes sentry with the DSN when enabled', () => {
    process.env.NODE_ENV = 'production';
    process.env.SENTRY_DSN = 'https://key@sentry.example/1';

    initSentry();

    expect(init).toHaveBeenCalledWith({ dsn: 'https://key@sentry.example/1' });
  });

  it('does nothing when disabled', () => {
    process.env.NODE_ENV = 'development';
    process.env.SENTRY_DSN = 'https://key@sentry.example/1';

    initSentry();

    expect(init).not.toHaveBeenCalled();
  });
});

describe('captureError', () => {
  it('captures and flushes the error when enabled', async () => {
    process.env.NODE_ENV = 'production';
    process.env.SENTRY_DSN = 'https://key@sentry.example/1';
    const err = new Error('db exploded');

    await captureError(err);

    expect(captureException).toHaveBeenCalledWith(err);
    expect(flush).toHaveBeenCalled();
  });

  it('does nothing when disabled', async () => {
    process.env.NODE_ENV = 'development';

    await captureError(new Error('db exploded'));

    expect(captureException).not.toHaveBeenCalled();
    expect(flush).not.toHaveBeenCalled();
  });

  it('never throws even if flushing fails', async () => {
    process.env.NODE_ENV = 'production';
    process.env.SENTRY_DSN = 'https://key@sentry.example/1';
    (flush as jest.Mock).mockRejectedValueOnce(new Error('network down'));

    await expect(captureError(new Error('db exploded'))).resolves.toBeUndefined();
  });
});

describe('captureLoginRateLimitExceeded', () => {
  it('captures a PII-free warning and flushes it when enabled', async () => {
    process.env.NODE_ENV = 'production';
    process.env.SENTRY_DSN = 'https://key@sentry.example/1';

    await captureLoginRateLimitExceeded(90);

    expect(captureMessage).toHaveBeenCalledWith('login rate limit exceeded', {
      level: 'warning',
      tags: { event: 'login_rate_limit_exceeded' },
      extra: { retryAfterSeconds: 90 },
    });
    expect(flush).toHaveBeenCalled();
  });

  it('does nothing when disabled', async () => {
    process.env.NODE_ENV = 'development';

    await captureLoginRateLimitExceeded(90);

    expect(captureMessage).not.toHaveBeenCalled();
    expect(flush).not.toHaveBeenCalled();
  });
});
