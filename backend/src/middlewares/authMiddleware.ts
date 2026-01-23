import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/token";
import { User } from "../generated/prisma/client";
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
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
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  try {
    const secret: string | undefined =
      process.env.NODE_ENV === "production"
        ? process.env.JWT_SECRET
        : process.env.JWT_SECRET_STAGING;

    if (!secret) throw new Error("JWT secret not found");
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }
};
