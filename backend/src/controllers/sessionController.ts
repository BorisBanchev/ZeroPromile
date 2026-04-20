import { Request, Response } from "express";
import {
  AddDrinkRequestBody,
  AddDrinkResponseBody,
  EndSessionResponseBody,
  GetSessionsResponseBody,
  GetSessionTimelineResponseBody,
  StartSessionRequestBody,
  StartSessionResponseBody,
  TimelineDataPoint,
} from "../types/calculateSobriety";
import { ErrorResponseBody } from "../types/errorResponse";
import { prisma } from "../config/db";
import {
  drinkToBAC,
  currentBAC,
  timeUntilSober,
} from "../utils/calculateSobriety";
import { Gender as PrismaGender } from "../generated/prisma/enums";
import { AppError } from "../error/appError";

export const startSession = async (
  req: Request<unknown, unknown, StartSessionRequestBody>,
  res: Response<StartSessionResponseBody | ErrorResponseBody>,
) => {
  if (!req.user) {
    throw new AppError("Not authorized", 401);
  }

  const { sessionName } = req.body;

  // check that no other active session exists

  const activeSession = await prisma.session.findFirst({
    where: { userId: req.user.id, active: true },
    select: { id: true },
  });

  if (activeSession) {
    throw new AppError("There is already an active session", 400);
  }

  const newSession = await prisma.session.create({
    data: {
      userId: req.user.id,
      name: sessionName,
      active: true,
    },
  });

  return res.status(201).json({
    status: "success",
    message: "Session started successfully",
    data: {
      sessionId: newSession.id,
      sessionName: newSession.name,
      active: newSession.active,
    },
  });
};

export const addDrinkToSession = async (
  req: Request<unknown, unknown, AddDrinkRequestBody>,
  res: Response<AddDrinkResponseBody | ErrorResponseBody>,
) => {
  if (!req.user) {
    throw new AppError("Not authorized", 401);
  }

  const { drink } = req.body;

  const session = await prisma.session.findFirst({
    where: { userId: req.user.id, active: true },
  });

  if (!session) {
    throw new AppError("Active session not found", 404);
  }

  const distributionFactor =
    req.user.gender === PrismaGender.MALE ? 0.68 : 0.55;
  const weightKg = req.user.weightKg;

  const bacContribution = drinkToBAC(
    drink.volumeMl,
    drink.abv,
    weightKg,
    distributionFactor,
  );

  const result = await prisma.$transaction(async (tx) => {
    await tx.sessionDrink.create({
      data: {
        sessionId: session.id,
        name: drink.name,
        volumeMl: drink.volumeMl,
        abv: drink.abv,
        bacContribution,
        consumedAt: new Date(),
      },
    });

    const drinks = await tx.sessionDrink.findMany({
      where: { sessionId: session.id },
      orderBy: { consumedAt: "asc" },
      select: { consumedAt: true, bacContribution: true },
    });

    const drinksForCalc = drinks.map((d) => ({
      time: new Date(d.consumedAt).getTime(),
      bac: d.bacContribution ?? 0,
    }));

    const bacNow = currentBAC(drinksForCalc, Date.now());

    await tx.$executeRaw`
      UPDATE "Session"
      SET "peakBac" = GREATEST("peakBac", ${bacNow})
      WHERE id = ${session.id}
    `;

    const updatedSession = await tx.session.findUnique({
      where: { id: session.id },
      select: { peakBac: true },
    });

    return {
      bacNow,
      peakBac: updatedSession!.peakBac,
    };
  });

  const sober = timeUntilSober(result.bacNow);

  return res.status(201).json({
    status: "success",
    message: "Drink added to session",
    data: {
      sessionId: session.id,
      drink: {
        name: drink.name,
        volumeMl: drink.volumeMl,
        abv: drink.abv,
        consumedAt: new Date().toISOString(),
        bacContribution,
      },
      currentBAC: result.bacNow,
      peakBac: result.peakBac,
      timeUntilSobriety: {
        hours: sober.untilSober.hours,
        minutes: sober.untilSober.minutes,
      },
    },
  });
};

export const endSession = async (
  req: Request,
  res: Response<EndSessionResponseBody | ErrorResponseBody>,
) => {
  if (!req.user) {
    throw new AppError("Not authorized", 401);
  }

  const session = await prisma.session.findFirst({
    where: { userId: req.user.id, active: true },
  });

  if (!session) {
    throw new AppError("Active session was not found", 404);
  }
  const updatedSession = await prisma.session.update({
    where: { id: session.id },
    data: {
      active: false,
      endedAt: new Date(),
    },
  });

  return res.status(200).json({
    status: "success",
    message: "Session ended",
    data: {
      sessionId: updatedSession.id,
      sessionName: updatedSession.name,
      active: updatedSession.active,
    },
  });
};

export const getSessionTimeline = async (
  req: Request<{ sessionId: string }>,
  res: Response<GetSessionTimelineResponseBody | ErrorResponseBody>,
) => {
  if (!req.user) {
    throw new AppError("Not authorized", 401);
  }

  const { sessionId } = req.params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      drinks: {
        orderBy: { consumedAt: "asc" },
      },
    },
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.userId !== req.user.id) {
    throw new AppError("Not authorized to access this session", 403);
  }

  if (session.active) {
    throw new AppError("Session is still active. End the session first", 400);
  }

  const timeline: TimelineDataPoint[] = session.drinks.map((drink) => ({
    consumedAt: drink.consumedAt.toISOString(),
    bacLevel: drink.bacContribution ?? 0,
    drinkName: drink.name,
  }));

  return res.status(200).json({
    status: "success",
    message: "Session timeline retrieved",
    data: {
      sessionId: session.id,
      sessionName: session.name,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt ? session.endedAt.toISOString() : null,
      active: session.active,
      timeline,
    },
  });
};

export const getUserSessions = async (
  req: Request,
  res: Response<GetSessionsResponseBody | ErrorResponseBody>,
) => {
  if (!req.user) {
    throw new AppError("Not authorized", 401);
  }

  const sessions = await prisma.session.findMany({
    where: { userId: req.user.id },
    orderBy: { startedAt: "desc" },
    include: {
      drinks: {
        orderBy: { consumedAt: "asc" },
        select: {
          consumedAt: true,
          bacContribution: true,
          name: true,
          volumeMl: true,
          abv: true,
        },
      },
      _count: {
        select: { drinks: true },
      },
    },
  });

  const result = sessions.map((session) => ({
    sessionId: session.id,
    sessionName: session.name,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    active: session.active,
    totalDrinks: session._count.drinks,
    peakBac: session.peakBac,
    drinks: session.drinks.map((d) => ({
      consumedAt: d.consumedAt.toISOString(),
      bacContribution: d.bacContribution ?? 0,
      drinkName: d.name,
      volumeMl: d.volumeMl,
      abv: d.abv,
    })),
  }));

  return res.status(200).json({
    status: "success",
    message: "Sessions retrieved",
    data: {
      sessions: result,
    },
  });
};
