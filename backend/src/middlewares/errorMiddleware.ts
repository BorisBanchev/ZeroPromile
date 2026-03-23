import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/appError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  } else if (error instanceof TokenExpiredError) {
    return res.status(401).json({ error: "jwt expired" });
  } else if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  } else if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.issues[0].message });
  } else if (error instanceof Error) {
    return res.status(500).json({ error: error.message });
  } else {
    return res.status(500).json({ error: "Internal server error" });
  }
};
