import type { RequestHandler } from "express";
import { newDrinkSchema } from "../validationSchemas/newDrinkSchema";

export const newDrinkParser: RequestHandler = (req, _res, next) => {
  try {
    newDrinkSchema.parse(req.body);
    next();
  } catch (err: unknown) {
    next(err);
  }
};
