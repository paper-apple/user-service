import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response, NextFunction } from 'express';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { AuthRequest } from '../../types/express.types';
import { AppError } from '../../utils/AppError';

describe('Role Middleware', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {};
    next = vi.fn();
  });

  it('should throw Unauthorized if user is missing', () => {
    const middleware = roleMiddleware(['ADMIN']);

    middleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unauthorized',
        status: 401,
      })
    );
  });

  it('should throw Access denied if role is not allowed', () => {
    const middleware = roleMiddleware(['ADMIN']);

    req.user = {
      userId: 1,
      role: 'USER',
    };

    middleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Access denied',
        status: 403,
      })
    );
  });

  it('should allow access for correct role', () => {
    const middleware = roleMiddleware(['ADMIN', 'USER']);

    req.user = {
      userId: 1,
      role: 'USER',
    };

    middleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});