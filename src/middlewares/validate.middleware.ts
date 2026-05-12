import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const validate = (
  schema: z.ZodSchema,
  source: "body" | "params" = "body"
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = await schema.safeParseAsync(req[source]);

    if (!result.success) {
      return next(
        new AppError(
          "Validation error",
          400,
          result.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message,
          }))
        )
      );
    }

    req.body = result.data;
    next();
  };
};
