import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === 'test';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later",
    retryAfter: "15 minutes",
  },
});

export const authLimiter = isTest
  ? (_req: any, _res: any, next: any) => next()
  : rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: 'Too many login attempts',
        retryAfter: '10 minutes',
      },
    });