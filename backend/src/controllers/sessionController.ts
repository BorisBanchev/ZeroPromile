import { Request, Response } from "express";
import {
  CreateSessionRequestBody,
  CreateSessionResponseBody,
} from "../types/calculateSobriety";
import { ErrorResponseBody } from "../types/errorResponse";
import { prisma } from "../config/db";

export const createSession = async (
  req: Request<unknown, unknown, CreateSessionRequestBody>,
  res: Response<CreateSessionResponseBody | ErrorResponseBody>,
) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Not authorized" });

  const { name } = req.body;
  try {
    const newSession = await prisma.session.create({
      data: {
        userId: userId,
        name: name,
      },
    });

    const payload: CreateSessionResponseBody = {
      status: "success",
      message: "Successfully created new session",
      data: {
        sessionId: newSession.id,
        name: newSession.name,
        startedAt: newSession.startedAt.toISOString(),
        active: newSession.active,
      },
    };

    return res.status(201).json(payload);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
