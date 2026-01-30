import { prisma } from "../config/db";
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

const register = async (
  req: Request<unknown, unknown, RegisterRequestBody>,
  res: Response<RegisterResponseBody | ErrorResponseBody>,
): Promise<Response<RegisterResponseBody | ErrorResponseBody>> => {
  const { name, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({
      error: "User already exists with this email",
    });
  }

  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const user = prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken((await user).id);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: (await user).id,
        name: name,
        email: email,
      },
      token,
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

  const token = generateToken(user.id);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    },
  });
};

const logout = (_req: Request, res: Response): Response => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });
  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export { register, login, logout };
