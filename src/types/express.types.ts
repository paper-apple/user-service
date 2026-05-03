import { Request } from "express";
import { AuthJwtPayload as AuthJwtPayload } from "./auth.types";

export interface AuthRequest extends Request {
  user?: AuthJwtPayload;
}