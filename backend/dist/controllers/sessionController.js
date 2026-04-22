"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSessions = exports.getSessionTimeline = exports.endSession = exports.addDrinkToSession = exports.startSession = void 0;
const db_1 = require("../config/db");
const calculateSobriety_1 = require("../utils/calculateSobriety");
const enums_1 = require("../generated/prisma/enums");
const appError_1 = require("../error/appError");
const startSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.AppError("Not authorized", 401);
    }
    const { sessionName } = req.body;
    // check that no other active session exists
    const activeSession = yield db_1.prisma.session.findFirst({
        where: { userId: req.user.id, active: true },
        select: { id: true },
    });
    if (activeSession) {
        throw new appError_1.AppError("There is already an active session", 400);
    }
    const newSession = yield db_1.prisma.session.create({
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
});
exports.startSession = startSession;
const addDrinkToSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.AppError("Not authorized", 401);
    }
    const { drink } = req.body;
    const session = yield db_1.prisma.session.findFirst({
        where: { userId: req.user.id, active: true },
    });
    if (!session) {
        throw new appError_1.AppError("Active session not found", 404);
    }
    const distributionFactor = req.user.gender === enums_1.Gender.MALE ? 0.68 : 0.55;
    const weightKg = req.user.weightKg;
    const bacContribution = (0, calculateSobriety_1.drinkToBAC)(drink.volumeMl, drink.abv, weightKg, distributionFactor);
    const result = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.sessionDrink.create({
            data: {
                sessionId: session.id,
                name: drink.name,
                volumeMl: drink.volumeMl,
                abv: drink.abv,
                bacContribution,
                consumedAt: new Date(),
            },
        });
        const drinks = yield tx.sessionDrink.findMany({
            where: { sessionId: session.id },
            orderBy: { consumedAt: "asc" },
            select: { consumedAt: true, bacContribution: true },
        });
        const drinksForCalc = drinks.map((d) => {
            var _a;
            return ({
                time: new Date(d.consumedAt).getTime(),
                bac: (_a = d.bacContribution) !== null && _a !== void 0 ? _a : 0,
            });
        });
        const bacNow = (0, calculateSobriety_1.currentBAC)(drinksForCalc, Date.now());
        yield tx.$executeRaw `
      UPDATE "Session"
      SET "peakBac" = GREATEST("peakBac", ${bacNow})
      WHERE id = ${session.id}
    `;
        const updatedSession = yield tx.session.findUnique({
            where: { id: session.id },
            select: { peakBac: true },
        });
        return {
            bacNow,
            peakBac: updatedSession.peakBac,
        };
    }));
    const sober = (0, calculateSobriety_1.timeUntilSober)(result.bacNow);
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
});
exports.addDrinkToSession = addDrinkToSession;
const endSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.AppError("Not authorized", 401);
    }
    const session = yield db_1.prisma.session.findFirst({
        where: { userId: req.user.id, active: true },
    });
    if (!session) {
        throw new appError_1.AppError("Active session was not found", 404);
    }
    const updatedSession = yield db_1.prisma.session.update({
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
});
exports.endSession = endSession;
const getSessionTimeline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.AppError("Not authorized", 401);
    }
    const { sessionId } = req.params;
    const session = yield db_1.prisma.session.findUnique({
        where: { id: sessionId },
        include: {
            drinks: {
                orderBy: { consumedAt: "asc" },
            },
        },
    });
    if (!session) {
        throw new appError_1.AppError("Session not found", 404);
    }
    if (session.userId !== req.user.id) {
        throw new appError_1.AppError("Not authorized to access this session", 403);
    }
    if (session.active) {
        throw new appError_1.AppError("Session is still active. End the session first", 400);
    }
    const timeline = session.drinks.map((drink) => {
        var _a;
        return ({
            consumedAt: drink.consumedAt.toISOString(),
            bacLevel: (_a = drink.bacContribution) !== null && _a !== void 0 ? _a : 0,
            drinkName: drink.name,
        });
    });
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
});
exports.getSessionTimeline = getSessionTimeline;
const getUserSessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.AppError("Not authorized", 401);
    }
    const sessions = yield db_1.prisma.session.findMany({
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
    const result = sessions.map((session) => {
        var _a, _b;
        return ({
            sessionId: session.id,
            sessionName: session.name,
            startedAt: session.startedAt.toISOString(),
            endedAt: (_b = (_a = session.endedAt) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
            active: session.active,
            totalDrinks: session._count.drinks,
            peakBac: session.peakBac,
            drinks: session.drinks.map((d) => {
                var _a;
                return ({
                    consumedAt: d.consumedAt.toISOString(),
                    bacContribution: (_a = d.bacContribution) !== null && _a !== void 0 ? _a : 0,
                    drinkName: d.name,
                    volumeMl: d.volumeMl,
                    abv: d.abv,
                });
            }),
        });
    });
    return res.status(200).json({
        status: "success",
        message: "Sessions retrieved",
        data: {
            sessions: result,
        },
    });
});
exports.getUserSessions = getUserSessions;
