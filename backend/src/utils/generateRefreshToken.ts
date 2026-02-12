import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../types/token";

export const generateRefreshToken = (userId: string): string => {
  const secret =
    process.env.NODE_ENV === "production"
      ? process.env.JWT_REFRESH_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET_STAGING;

  if (!secret) throw new Error("REFRESH_TOKEN_SECRET is not defined");

  const expiresIn = process.env
    .REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"];

  const payload: JwtPayload = { id: userId };
  const token = jwt.sign(payload, secret as jwt.Secret, { expiresIn });

  return token;
};
