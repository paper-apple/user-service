import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express.types";
import { JwtPayload } from "../types/auth.types";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("No token");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'supersecret'
    ) as JwtPayload;

    req.user = decoded; // Adding payload to a request

    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};