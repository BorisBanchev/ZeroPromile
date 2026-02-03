import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { newSessionParser } from "../middlewares/newSessionParser";
import {
  addDrinkToSession,
  startSession,
} from "../controllers/sessionController";
import { newDrinkParser } from "../middlewares/newDrinkParser";

const router = express.Router();

router.use(authMiddleware);

router.post("/", newSessionParser, startSession);

router.post("/drinks", newDrinkParser, addDrinkToSession);

router.use(errorMiddleware);

export default router;
