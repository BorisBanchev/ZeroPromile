import express from "express";
import { rateLimit } from "express-rate-limit";

// import routes
import authRoutes from "./routes/authRoutes";
import updateProfileRoutes from "./routes/updateProfileRoutes";
import sessionsRoutes from "./routes/sessionsRoutes";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: { error: "Too many requests, please try again later" },
});

const app = express();

app.use(express.json());
app.use(limiter);
app.use("/api/auth", authRoutes);
app.use("/api/update/profile", updateProfileRoutes);
app.use("/api/sessions", sessionsRoutes);

export default app;
