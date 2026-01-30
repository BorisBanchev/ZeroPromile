import type { RequestHandler } from "express";
import { newUserEntrySchema } from "../validationSchemas/newUserEntrySchema";

export const newUserParser: RequestHandler = (req, _res, next) => {
  try {
    newUserEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
