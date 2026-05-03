import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express.types";
import { AppError } from "../utils/AppError";

export const roleMiddleware = (roles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Access denied", 403);
    }

    next();
  };
};