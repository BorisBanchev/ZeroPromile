import type { RequestHandler } from "express";
import { newSessionSchema } from "../validationSchemas/newSessionSchema";

export const newSessionParser: RequestHandler = (req, _res, next) => {
  try {
    newSessionSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
