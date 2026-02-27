import { prisma } from "../config/db";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../types/token";
import bcrypt from "bcryptjs";
import {
  RegisterRequestBody,
  RegisterResponseBody,
  LoginRequestBody,
  LoginResponseBody,
} from "../types/user";
import { ErrorResponseBody } from "../types/errorResponse";
import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import { Gender } from "../generated/prisma/enums";

const register = async (
  req: Request<unknown, unknown, RegisterRequestBody>,
  res: Response<RegisterResponseBody | ErrorResponseBody>,
): Promise<Response<RegisterResponseBody | ErrorResponseBody>> => {
  const { name, email, password, passwordConfirm, gender, weightKg } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({
      error: "User already exists with this email",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      error: "Passwords don't match",
    });
  }

  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const prismaGender = gender?.toString().toUpperCase() as Gender;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      gender: prismaGender,
      weightKg,
    },
  });

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
        gender: gender,
        weightKg: weightKg,
      },
      accessToken,
      refreshToken,
    },
  });
};

const login = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response<LoginResponseBody | ErrorResponseBody>,
): Promise<Response<LoginResponseBody | ErrorResponseBody>> => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: email,
        gender: user.gender,
        weightKg: user.weightKg,
      },
      accessToken,
      refreshToken,
    },
  });
};

const refreshTokenEndpoint = async (
  req: Request<unknown, unknown, { refreshToken: string }>,
  res: Response,
): Promise<Response> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const secret: string | undefined =
      process.env.NODE_ENV === "production"
        ? process.env.REFRESH_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET_STAGING;

    if (!secret) throw new Error("REFRESH_TOKEN_SECRET not found");

    const decoded = jwt.verify(refreshToken, secret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    const accessToken = generateToken(decoded.id);

    return res.json({
      status: "success",
      data: {
        accessToken,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (_req: Request, res: Response): Response => {
  // logout is handled on the client by deleting tokens
  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout, refreshTokenEndpoint };
