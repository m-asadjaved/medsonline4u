import { RateLimiterMemory } from 'rate-limiter-flexible';

export const rateLimiter = new RateLimiterMemory({
  points: 20, // 10 requests
  duration: 10, // per 10 seconds
});