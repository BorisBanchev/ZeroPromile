import type { Request, Response } from "express";
import { prisma } from "../config/db";
import { Gender as PrismaGender } from "../generated/prisma/enums";

type ReqBody = { gender: "male" | "female"; weight: number };

const setGenderAndWeight = async (
  req: Request<unknown, unknown, ReqBody>,
  res: Response,
): Promise<Response> => {
  const { gender, weight } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const mappedGender =
    gender === "male" ? PrismaGender.MALE : PrismaGender.FEMALE;

  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { gender: mappedGender, weightKg: weight },
      select: { gender: true, weightKg: true },
    });

    return res.status(200).json({
      status: "success",
      message: "successfully updated user profile",
      data: { gender: updated.gender, weightKg: updated.weightKg },
    });
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

export { setGenderAndWeight };
