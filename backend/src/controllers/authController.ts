import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import {
  RegisterRequestBody,
  RegisterResponseBody,
  ErrorResponseBody,
} from "../types/user";
import { Request, Response } from "express";

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

  // hash password
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  // create user
  const user = prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json({
    status: "success",
    data: {
      user: {
        id: (await user).id,
        name: name,
        email: email,
      },
    },
  });
};

export { register };
