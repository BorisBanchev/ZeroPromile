import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { newSessionParser } from "../middlewares/newSessionParser";
import { startSession } from "../controllers/sessionController";

const router = express.Router();

router.use(authMiddleware);

router.post("/", newSessionParser, startSession);

router.use(errorMiddleware);

export default router;
