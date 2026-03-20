import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/token";
import { AppError } from "../error/appError";
import { User } from "../generated/prisma/client";
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  let token: string | null = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt as string;
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  const secret: string | undefined =
    process.env.NODE_ENV === "production"
      ? process.env.JWT_TOKEN_SECRET
      : process.env.JWT_TOKEN_SECRET_STAGING;

  if (!secret) throw new AppError("Internal server error", 500);
  const decoded = jwt.verify(token, secret) as JwtPayload;
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  req.user = user;
  next();
};
