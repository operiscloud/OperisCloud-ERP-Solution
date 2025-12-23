// Simple in-memory rate limiter
// For production, consider using Redis or Upstash

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // in milliseconds
  maxRequests: number;
}

export function rateLimit(identifier: string, config: RateLimitConfig): {
  success: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    };
  }

  store[key].count++;

  if (store[key].count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  };
}

// Preset configurations
export const RATE_LIMIT_CONFIGS = {
  // Standard API calls - 100 requests per minute
  api: {
    interval: 60 * 1000,
    maxRequests: 100,
  },
  // Authentication attempts - 5 per minute
  auth: {
    interval: 60 * 1000,
    maxRequests: 5,
  },
  // File uploads - 10 per hour
  upload: {
    interval: 60 * 60 * 1000,
    maxRequests: 10,
  },
  // Bulk operations - 5 per hour
  bulk: {
    interval: 60 * 60 * 1000,
    maxRequests: 5,
  },
  // Team invitations - 20 per hour
  invite: {
    interval: 60 * 60 * 1000,
    maxRequests: 20,
  },
};
