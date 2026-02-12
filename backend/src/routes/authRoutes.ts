import express from "express";
import {
  login,
  logout,
  refreshTokenEndpoint,
  register,
} from "../controllers/authController";
import { newUserParser } from "../middlewares/newUserParser";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = express.Router();

router.post("/register", newUserParser, register);

router.post("/login", login);

router.post("/refresh-token", refreshTokenEndpoint);

router.post("/logout", logout);

router.use(errorMiddleware);

export default router;
