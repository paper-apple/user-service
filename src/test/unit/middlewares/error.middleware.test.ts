import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { AppError } from '@/utils/AppError';

describe('Error Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it('should handle AppError correctly', () => {
    const error = new AppError('Forbidden', 403);

    errorMiddleware(
      error,
      req as Request,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden',
      details: null,
    });
  });

  it('should return 500 for unknown errors', () => {
    const error = new Error('Unknown error');

    errorMiddleware(
      error,
      req as Request,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
  });
});