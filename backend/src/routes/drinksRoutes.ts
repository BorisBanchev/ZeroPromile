import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { newSessionParser } from "../middlewares/newSessionParser";
import {
  addDrinkToSession,
  startSession,
  endSession,
  getSessionTimeline,
  getUserSessions,
} from "../controllers/sessionController";
import { newDrinkParser } from "../middlewares/newDrinkParser";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getUserSessions);

router.post("/", newSessionParser, startSession);

router.post("/drinks", newDrinkParser, addDrinkToSession);

router.patch("/endsession", endSession);

router.get("/:sessionId/timeline", getSessionTimeline);

router.use(errorMiddleware);

export default router;
