import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { setGenderAndWeight } from "../controllers/updateUserProfileController";
import { newUpdateProfileParser } from "../middlewares/newUpdateProfileMiddleware.ts";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.patch("/", newUpdateProfileParser, setGenderAndWeight);

router.use(errorMiddleware);

export default router;
