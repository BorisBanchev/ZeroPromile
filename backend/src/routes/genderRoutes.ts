import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { setGender } from "../controllers/genderController";
import { newGenderParser } from "../middlewares/newGenderParser";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.put("/", newGenderParser, setGender);

router.use(errorMiddleware);

export default router;
