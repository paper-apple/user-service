import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express.types";
import { AppError } from "../utils/AppError";
import { AuthJwtPayload } from "../types/auth.types";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Unauthorized", 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT_SECRET is required", 500);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, secret);

      if (typeof decoded === "string") {
        return next(new AppError("Invalid token", 401));
      }

      req.user = decoded as AuthJwtPayload;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError("Token expired", 401));
      }

      return next(new AppError("Invalid token", 401));
    }
  } catch (error) {
    next(error);
  }
};