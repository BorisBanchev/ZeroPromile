import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../types/token";

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "7d") as jwt.SignOptions["expiresIn"];

  const payload: JwtPayload = { id: userId };
  const token = jwt.sign(payload, secret as jwt.Secret, { expiresIn });

  return token;
};
