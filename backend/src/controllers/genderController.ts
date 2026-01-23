import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { Gender as PrismaGender } from "../generated/prisma/enums";

type ReqBody = { gender: "male" | "female" };

const setGender = async (
  req: Request<unknown, unknown, ReqBody>,
  res: Response,
): Promise<Response> => {
  const { gender } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const mappedGender =
    gender === "male" ? PrismaGender.MALE : PrismaGender.FEMALE;

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { gender: mappedGender },
    });

    return res.status(200).json({
      status: "success",
      data: { gender: updated.gender },
    });
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
    return res.status(500).json({ error: "Failed to update gender" });
  }
};

export { setGender };
