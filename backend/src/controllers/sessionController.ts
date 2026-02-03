import { Request, Response } from "express";
import {
  StartSessionRequestBody,
  StartSessionResponseBody,
} from "../types/calculateSobriety";
import { ErrorResponseBody } from "../types/errorResponse";
import { prisma } from "../config/db";
import {
  drinkToBAC,
  currentBAC,
  timeUntilSober,
} from "../utils/calculateSobriety";
import { Gender as PrismaGender } from "../generated/prisma/enums";

export const startSession = async (
  req: Request<unknown, unknown, StartSessionRequestBody>,
  res: Response<StartSessionResponseBody | ErrorResponseBody>,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { sessionName, drink } = req.body;

  // check that no other active session exists
  try {
    const activeSession = await prisma.session.findFirst({
      where: { userId: req.user.id, active: true },
      select: { id: true },
    });

    if (activeSession) {
      return res
        .status(400)
        .json({ error: "There is already an active session" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
    return res.status(500).json({ error: "Failed checking active sessions" });
  }

  const volumeMl: number = drink.volumeMl;
  const abv: number = drink.abv;

  const distributionFactor: number =
    req.user.gender === PrismaGender.MALE ? 0.68 : 0.55;
  const weightKg: number = req.user.weightKg;

  const bacContribution: number = drinkToBAC(
    volumeMl,
    abv,
    weightKg,
    distributionFactor,
  );

  try {
    const newSession = await prisma.session.create({
      data: {
        userId: req.user.id,
        name: sessionName,
        drinks: {
          create: {
            name: drink.name,
            volumeMl,
            abv,
            bacContribution,
            consumedAt: new Date(),
          },
        },
      },
      include: {
        drinks: true,
      },
    });

    const drinksForCalc = newSession.drinks.map((d) => ({
      time: new Date(d.consumedAt).getTime(),
      bac: d.bacContribution ?? 0,
    }));

    const nowMs = Date.now();
    const totalPromilles = currentBAC(drinksForCalc, nowMs);
    const sober = timeUntilSober(totalPromilles);

    return res.status(201).json({
      status: "success",
      message: "Session started",
      data: {
        sessionName,
        drink: {
          name: drink.name,
          volumeMl,
          abv,
        },
        timeUntilSobriety: {
          hours: sober.untilSober.hours,
          minutes: sober.untilSober.minutes,
        },
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) console.error(err.message);
    return res.status(500).json({ error: "Failed to start session" });
  }
};
