import { createLoginRateLimit } from '../login-rate-limit';

const NOW = 1_700_000_000_000;

const allowed = { success: true, reset: NOW + 15 * 60 * 1000 };

const makeLimiter = (result = allowed) => ({
  limit: jest.fn().mockResolvedValue(result),
});

describe('login rate limit', () => {
  it('checks independent username and IP limits', async () => {
    const usernameLimiter = makeLimiter();
    const ipLimiter = makeLimiter();
    const check = createLoginRateLimit({ usernameLimiter, ipLimiter, secret: 'test-secret' });

    const result = await check({ username: ' Ada ', ip: '203.0.113.7', now: NOW });

    expect(result).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(usernameLimiter.limit).toHaveBeenCalledTimes(1);
    expect(ipLimiter.limit).toHaveBeenCalledTimes(1);
    expect(usernameLimiter.limit).toHaveBeenCalledWith(expect.stringMatching(/^login:username:/));
    expect(ipLimiter.limit).toHaveBeenCalledWith(expect.stringMatching(/^login:ip:/));
  });

  it('normalizes username casing and surrounding whitespace before hashing', async () => {
    const usernameLimiter = makeLimiter();
    const ipLimiter = makeLimiter();
    const check = createLoginRateLimit({ usernameLimiter, ipLimiter, secret: 'test-secret' });

    await check({ username: ' Ada ', ip: '203.0.113.7', now: NOW });
    await check({ username: 'ada', ip: '203.0.113.8', now: NOW });

    expect(usernameLimiter.limit.mock.calls[0][0]).toBe(usernameLimiter.limit.mock.calls[1][0]);
  });

  it('does not expose raw usernames or IP addresses in limiter keys', async () => {
    const usernameLimiter = makeLimiter();
    const ipLimiter = makeLimiter();
    const check = createLoginRateLimit({ usernameLimiter, ipLimiter, secret: 'test-secret' });

    await check({ username: 'ada', ip: '203.0.113.7', now: NOW });

    expect(usernameLimiter.limit.mock.calls[0][0]).not.toContain('ada');
    expect(ipLimiter.limit.mock.calls[0][0]).not.toContain('203.0.113.7');
  });

  it('rejects when the username limit is exceeded', async () => {
    const usernameLimiter = makeLimiter({ success: false, reset: NOW + 30_000 });
    const ipLimiter = makeLimiter();
    const check = createLoginRateLimit({ usernameLimiter, ipLimiter, secret: 'test-secret' });

    const result = await check({ username: 'ada', ip: '203.0.113.7', now: NOW });

    expect(result).toEqual({ allowed: false, retryAfterSeconds: 30 });
  });

  it('rejects when the IP limit is exceeded', async () => {
    const usernameLimiter = makeLimiter();
    const ipLimiter = makeLimiter({ success: false, reset: NOW + 45_000 });
    const check = createLoginRateLimit({ usernameLimiter, ipLimiter, secret: 'test-secret' });

    const result = await check({ username: 'ada', ip: '203.0.113.7', now: NOW });

    expect(result).toEqual({ allowed: false, retryAfterSeconds: 45 });
  });

  it('uses the later reset when both limits are exceeded', async () => {
    const usernameLimiter = makeLimiter({ success: false, reset: NOW + 30_000 });
    const ipLimiter = makeLimiter({ success: false, reset: NOW + 90_000 });
    const check = createLoginRateLimit({ usernameLimiter, ipLimiter, secret: 'test-secret' });

    const result = await check({ username: 'ada', ip: '203.0.113.7', now: NOW });

    expect(result).toEqual({ allowed: false, retryAfterSeconds: 90 });
  });
});
