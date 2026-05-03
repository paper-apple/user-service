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

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      throw new AppError("Invalid token payload", 401);
    }

    req.user = decoded as AuthJwtPayload; // Adding payload to a request

    next();
  } catch (error) {
    next(error);
  }
};