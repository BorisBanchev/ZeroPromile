import type { RequestHandler } from "express";
import { newUpdateProfileSchema } from "../validationSchemas/newUpdateProfileSchema";

export const newUpdateProfileParser: RequestHandler = (req, _res, next) => {
  try {
    newUpdateProfileSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
