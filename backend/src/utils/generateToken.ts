import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../types/token";
import { AppError } from "../error/appError";

export const generateToken = (userId: string): string => {
  const secret =
    process.env.APP_ENV === "production"
      ? process.env.JWT_TOKEN_SECRET
      : process.env.JWT_TOKEN_SECRET_STAGING;
  if (!secret) throw new AppError("JWT_SECRET is not defined", 401);

  const expiresIn = process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];

  const payload: JwtPayload = { id: userId };
  const token = jwt.sign(payload, secret as jwt.Secret, { expiresIn });

  return token;
};
