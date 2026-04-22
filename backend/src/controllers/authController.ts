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
import { AppError } from "../error/appError";

const register = async (
  req: Request<unknown, unknown, RegisterRequestBody>,
  res: Response<RegisterResponseBody | ErrorResponseBody>,
): Promise<Response<RegisterResponseBody | ErrorResponseBody>> => {
  const { name, email, password, passwordConfirm, gender, weightKg } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    throw new AppError("User already exists with this email", 400);
  }

  if (password !== passwordConfirm) {
    throw new AppError("Passwords don't match", 400);
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
        gender: gender.toLocaleLowerCase() as "male" | "female",
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
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
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
        gender: user.gender.toLocaleLowerCase() as "male" | "female",
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
    throw new AppError("Refresh token required", 401);
  }

  const secret: string | undefined =
    process.env.APP_ENV === "production"
      ? process.env.JWT_REFRESH_TOKEN_SECRET
      : process.env.JWT_REFRESH_TOKEN_SECRET_STAGING;

  if (!secret) throw new AppError("REFRESH_TOKEN_SECRET not found", 401);

  const decoded = jwt.verify(refreshToken, secret) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  const accessToken = generateToken(decoded.id);

  return res.json({
    status: "success",
    data: {
      accessToken,
    },
  });
};

const logout = (_req: Request, res: Response): Response => {
  // logout is handled on the client by deleting tokens
  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout, refreshTokenEndpoint };
