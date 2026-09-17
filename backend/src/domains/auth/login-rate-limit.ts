import { createHmac } from 'crypto';

export interface RateLimiter {
  limit(identifier: string): Promise<{ success: boolean; reset: number }>;
}

interface LoginRateLimitDependencies {
  usernameLimiter: RateLimiter;
  ipLimiter: RateLimiter;
  secret: string;
}

interface LoginRateLimitInput {
  username: string;
  ip: string;
  now?: number;
}

interface LoginRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const identifierKey = (kind: 'username' | 'ip', value: string, secret: string): string =>
  `login:${kind}:${createHmac('sha256', secret).update(value).digest('hex')}`;

export const createLoginRateLimit =
  ({ usernameLimiter, ipLimiter, secret }: LoginRateLimitDependencies) =>
  async ({
    username,
    ip,
    now = Date.now(),
  }: LoginRateLimitInput): Promise<LoginRateLimitResult> => {
    const [usernameResult, ipResult] = await Promise.all([
      usernameLimiter.limit(identifierKey('username', username.trim().toLowerCase(), secret)),
      ipLimiter.limit(identifierKey('ip', ip, secret)),
    ]);
    const blocked = [usernameResult, ipResult].filter((result) => !result.success);
    if (blocked.length === 0) return { allowed: true, retryAfterSeconds: 0 };

    const reset = Math.max(...blocked.map((result) => result.reset));
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((reset - now) / 1000)),
    };
  };
