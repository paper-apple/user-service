import { NextFunction, Response, Request } from "express";
import { AppError } from "../utils/AppError";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details || null,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
};