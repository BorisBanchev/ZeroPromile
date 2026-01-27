import express from "express";
import { login, logout, register } from "../controllers/authController";
import { newUserParser } from "../middlewares/newUserParser";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = express.Router();

router.post("/register", newUserParser, register);

router.post("/login", login);

router.post("/logout", logout);

router.use(errorMiddleware);

export default router;
