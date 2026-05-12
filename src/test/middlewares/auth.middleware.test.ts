import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { AuthRequest } from '../../types/express.types';
import { AuthJwtPayload } from '../../types/auth.types';

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    TokenExpiredError: class TokenExpiredError extends Error {},
  },
}));

const mockUser: AuthJwtPayload = {
  userId: 1,
  role: 'USER',
};

describe('Auth Middleware', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {};

    next = vi.fn();

    process.env.JWT_SECRET = 'secret';
  });

  it('should authenticate user successfully', () => {
    req.headers = {
      authorization: 'Bearer valid-token',
    };

    (jwt.verify as Mock).mockReturnValue(mockUser);

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      'valid-token',
      'secret'
    );

    expect(req.user).toEqual(mockUser);

    expect(next).toHaveBeenCalledWith();
  });

  it('should return unauthorized if authorization header is missing', () => {
    authMiddleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unauthorized',
        status: 401,
      })
    );

    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should throw error if JWT_SECRET is missing', () => {
    req.headers = {
      authorization: 'Bearer valid-token',
    };

    delete process.env.JWT_SECRET;

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'JWT_SECRET is required',
        status: 500,
      })
    );

    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should return invalid token if jwt.verify throws error', () => {
    req.headers = {
      authorization: 'Bearer invalid-token',
    };

    (jwt.verify as Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid token',
        status: 401,
      })
    );
  });

  it('should return token expired error', () => {
    req.headers = {
      authorization: 'Bearer expired-token',
    };

    (jwt.verify as Mock).mockImplementation(() => {
      throw new jwt.TokenExpiredError('Token expired', new Date());
    });

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Token expired',
        status: 401,
      })
    );
  });

  it('should return invalid token if decoded token is string', () => {
    req.headers = {
      authorization: 'Bearer valid-token',
    };

    (jwt.verify as Mock).mockReturnValue('decoded-string');

    authMiddleware(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid token',
        status: 401,
      })
    );

    expect(req.user).toBeUndefined();
  });
});