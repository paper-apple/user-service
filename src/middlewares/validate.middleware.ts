import { z } from "zod";
import { Request, Response, NextFunction } from "express";

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
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
};
