import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { createUpstashLoginRateLimit } from '../upstash-login-rate-limit';

jest.mock('@upstash/ratelimit', () => {
  const RatelimitMock = jest.fn();
  return {
    Ratelimit: Object.assign(RatelimitMock, {
      slidingWindow: jest.fn((limit: number, window: string) => ({ limit, window })),
    }),
  };
});

jest.mock('@upstash/redis', () => ({
  Redis: { fromEnv: jest.fn(() => ({ redis: true })) },
}));

const mockUsernameLimit = jest.fn();
const mockIpLimit = jest.fn();
const mockRatelimitConstructor = Ratelimit as unknown as jest.Mock;
const mockSlidingWindow = Ratelimit.slidingWindow as jest.Mock;
const mockRedisFromEnv = Redis.fromEnv as jest.Mock;

describe('createUpstashLoginRateLimit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRatelimitConstructor
      .mockReturnValueOnce({ limit: mockUsernameLimit })
      .mockReturnValueOnce({ limit: mockIpLimit });
    mockUsernameLimit.mockResolvedValue({ success: true, reset: 0 });
    mockIpLimit.mockResolvedValue({ success: true, reset: 0 });
  });

  it('creates independent strict sliding-window limits for username and IP', async () => {
    const check = createUpstashLoginRateLimit('rate-limit-secret');

    await check({ username: 'ada', ip: '203.0.113.7' });

    expect(mockRedisFromEnv).toHaveBeenCalledTimes(1);
    expect(mockSlidingWindow).toHaveBeenNthCalledWith(1, 5, '15 m');
    expect(mockSlidingWindow).toHaveBeenNthCalledWith(2, 20, '15 m');
    expect(mockRatelimitConstructor).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        redis: { redis: true },
        limiter: { limit: 5, window: '15 m' },
        prefix: 'la-oliva:login:username',
      }),
    );
    expect(mockRatelimitConstructor).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        redis: { redis: true },
        limiter: { limit: 20, window: '15 m' },
        prefix: 'la-oliva:login:ip',
      }),
    );
    expect(mockUsernameLimit).toHaveBeenCalledTimes(1);
    expect(mockIpLimit).toHaveBeenCalledTimes(1);
  });
});
