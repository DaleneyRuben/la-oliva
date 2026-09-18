import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { getSecret } from './_helpers';
import {
  createLoginRateLimit,
  LoginRateLimitInput,
  LoginRateLimitResult,
} from './login-rate-limit';

const WINDOW = '15 m';

export const createUpstashLoginRateLimit = (secret: string) => {
  const redis = Redis.fromEnv();
  const usernameLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, WINDOW),
    analytics: false,
    prefix: 'la-oliva:login:username',
  });
  const ipLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, WINDOW),
    analytics: false,
    prefix: 'la-oliva:login:ip',
  });

  return createLoginRateLimit({ usernameLimiter, ipLimiter, secret });
};

let check: ReturnType<typeof createUpstashLoginRateLimit> | undefined;

export const checkLoginRateLimit = (input: LoginRateLimitInput): Promise<LoginRateLimitResult> => {
  check ??= createUpstashLoginRateLimit(getSecret());
  return check(input);
};
