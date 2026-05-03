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
    try {
      await schema.parseAsync(req[source]);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new AppError(
            "Validation error",
            400,
            error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            }))
          )
        );
      }

      next(error);
    }
  };
};
