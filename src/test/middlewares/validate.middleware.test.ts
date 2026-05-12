import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware';

describe('Validate Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {};
    next = vi.fn();
  });

  it('should call next for valid data', async () => {
    const schema = z.object({
      name: z.string(),
    });

    req.body = {
      name: 'John',
    };

    const middleware = validate(schema);

    await middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should return error for invalid body', async () => {
    const schema = z.object({
      name: z.string(),
    });

    req.body = {
      name: 123,
    };

    const middleware = validate(schema);

    await middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation error',
        status: 400,
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.any(String),
          }),
        ]),
      })
    );
  });

  it('should return error for invalid params', async () => {
    const schema = z.object({
      id: z.coerce.number().int().positive(),
    });

    req.params = {
      id: 'user',
    };

    const middleware = validate(schema, "params");

    await middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Validation error',
        status: 400,
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'id',
            message: expect.any(String),
          }),
        ]),
      })
    );
  });
});