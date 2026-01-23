import type { RequestHandler } from "express";
import { newGenderEntrySchema } from "../utils/newGenderEntrySchema";

export const newGenderParser: RequestHandler = (req, _res, next) => {
  try {
    newGenderEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
