import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const createValidatorMiddleware =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = z.safeParse(schema, req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "The request body contains validation errors.",
        details: z.flattenError(result.error).fieldErrors,
      });
    }
    next();
  };

export default createValidatorMiddleware;
