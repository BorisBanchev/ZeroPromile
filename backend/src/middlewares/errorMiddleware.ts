import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/appError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
  } else if (error instanceof TokenExpiredError) {
    res.status(401).json({ error: "jwt expired" });
  } else if (error instanceof JsonWebTokenError) {
    res.status(401).json({ error: "Not authorized, token failed" });
  } else if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues[0].message });
  } else if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};
